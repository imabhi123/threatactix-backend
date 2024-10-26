import axios from "axios";

// Get API credentials from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

// Function to get more details using OpenAI API
async function getOpenAIDetails(query) {
    if (!query) {
        throw new Error('Query parameter is required');
    }

    const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not found in environment variables');
    }

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: query }],
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error from OpenAI:', error.response?.data || error.message);
        return null; // Return null instead of throwing to allow partial results
    }
}

// Function to search Google using the Custom Search API
async function searchGoogle(query) {
    if (!query) {
        throw new Error('Query parameter is required');
    }

    const GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

    if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
        throw new Error('Google API credentials not found in environment variables');
    }

    try {
        const response = await axios.get(GOOGLE_SEARCH_URL, {
            params: {
                key: GOOGLE_API_KEY,
                cx: SEARCH_ENGINE_ID,
                q: encodeURIComponent(query), // Properly encode the query
                num: 5,
                safe: 'active', // Add safe search
                fields: 'items(title,link,snippet)' // Specify required fields
            },
            timeout: 5000 // 5 second timeout
        });
        console.log(response.data.items)

        if (!response.data.items) {
            return []; // Return empty array if no results
        }

        return response.data.items.map(item => ({
            title: item.title || '',
            link: item.link || '',
            snippet: item.snippet || ''
        }));
    } catch (error) {
        console.error('Google Search Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            query: query
        });
        return []; // Return empty array instead of throwing
    }
}

// Main function to gather both OpenAI and Google Search results
async function gatherMoreDetails(inputDetail) {
    // Input validation
    if (!inputDetail) {
        throw new Error('Input detail is required');
    }

    try {
        console.log('Processing query:', inputDetail);

        // Gather results sequentially to better handle errors
        let results = {
            aiInsights: null,
            webResults: []
        };

        try {
            results.aiInsights = await getOpenAIDetails(inputDetail);
        } catch (error) {
            console.error('OpenAI Error:', error.message);
        }

        try {
            results.webResults = await searchGoogle(inputDetail);
        } catch (error) {
            console.error('Google Search Error:', error.message);
        }

        // Return partial results even if some operations failed
        return results;
    } catch (error) {
        console.error('Error gathering details:', error.message);
        throw error;
    }
}

// Export the function
export default gatherMoreDetails;

// Optional: Export individual functions for testing
export { getOpenAIDetails, searchGoogle };
 
// import axios from "axios";
// import dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// // Get API credentials from environment variables - only using Google now
// const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
// const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

// // Function to search Google using the Custom Search API
// async function searchGoogle(query) {
//   if (!query) {
//     throw new Error("Query parameter is required");
//   }

//   const GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1";

//   if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
//     throw new Error(
//       "Google API credentials not found in environment variables"
//     );
//   }

//   try {
//     const response = await axios.get(GOOGLE_SEARCH_URL, {
//       params: {
//         key: GOOGLE_API_KEY,
//         cx: SEARCH_ENGINE_ID,
//         q: encodeURIComponent(query),
//         num: 5,
//         safe: "active",
//         fields: "items(title,link,snippet,pagemap(metatags))",
//       },
//       timeout: 5000,
//     });

//     if (!response.data.items) {
//       return [];
//     }

//     // Enhanced result processing with metadata extraction
//     return response.data.items.map((item) => ({
//       title: item.title || "",
//       link: item.link || "",
//       snippet: item.snippet || "",
//       metadata: extractMetadata(item),
//     }));
//   } catch (error) {
//     console.error("Google Search Error:", {
//       message: error.message,
//       response: error.response?.data,
//       status: error.response?.status,
//       query: query,
//     });
//     return [];
//   }
// }

// // Helper function to extract metadata from search results
// function extractMetadata(item) {
//   try {
//     const metadata = {
//       description: "",
//       keywords: "",
//       type: "",
//     };

//     if (item.pagemap?.metatags?.[0]) {
//       const metatags = item.pagemap.metatags[0];
//       metadata.description =
//         metatags["og:description"] || metatags["description"] || "";
//       metadata.keywords = metatags["keywords"] || "";
//       metadata.type = metatags["og:type"] || "";
//     }

//     return metadata;
//   } catch (error) {
//     console.error("Metadata extraction error:", error);
//     return {};
//   }
// }

// // Function to summarize content using basic NLP techniques
// function summarizeContent(text) {
//   if (!text) return "";

//   // Split into sentences
//   const sentences = text.split(/[.!?]+/);

//   // Basic importance scoring (you can enhance this)
//   const scoredSentences = sentences.map((sentence) => ({
//     sentence: sentence.trim(),
//     score: scoreImportance(sentence),
//   }));

//   // Sort by score and take top 2 sentences
//   const topSentences = scoredSentences
//     .sort((a, b) => b.score - a.score)
//     .slice(0, 2)
//     .map((item) => item.sentence)
//     .join(". ");

//   return topSentences + ".";
// }

// // Helper function to score sentence importance
// function scoreImportance(sentence) {
//   const keywords = ["what", "how", "why", "is", "are", "can", "will", "should"];
//   const words = sentence.toLowerCase().split(" ");

//   let score = 0;
//   score += words.length >= 10 ? 2 : 0; // Favor medium-length sentences
//   score += keywords.some((keyword) => words.includes(keyword)) ? 3 : 0;
//   score += /\d+/.test(sentence) ? 2 : 0; // Favor sentences with numbers

//   return score;
// }

// // Main function to gather and process search results
// async function gatherMoreDetails(inputDetail) {
//   if (!inputDetail) {
//     throw new Error("Input detail is required");
//   }

//   try {
//     console.log("Processing query:", inputDetail);

//     // Get search results
//     const webResults = await searchGoogle(inputDetail);

//     // Process and enhance results
//     const enhancedResults = webResults.map((result) => ({
//       ...result,
//       summary: summarizeContent(
//         result.snippet + " " + result.metadata.description
//       ),
//     }));

//     console.log({
//       query: inputDetail,
//       results: enhancedResults,
//       totalResults: enhancedResults.length,
//       processedAt: new Date().toISOString(),
//     });
//     return {
//       query: inputDetail,
//       results: enhancedResults,
//       totalResults: enhancedResults.length,
//       processedAt: new Date().toISOString(),
//     };
//   } catch (error) {
//     console.error("Error gathering details:", error.message);
//     throw error;
//   }
// }

// export default gatherMoreDetails;
// export { searchGoogle, summarizeContent };
