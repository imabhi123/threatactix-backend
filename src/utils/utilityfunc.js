// export const transformIncidentData=(incident)=> {
//     return {
//       title: incident.title,
//       status: incident.status,
//       url: incident.url,
//       threatActor: {
//         name: incident.threatActor_name,
//         type: incident.threatActor_type,
//       },
//       rawContent: incident.rawContent,
//       publicationDate: new Date(incident.publicationDate),
//       plannedPublicationDate: incident.plannedPublicationDate
//         ? new Date(incident.plannedPublicationDate)
//         : undefined,
//       category: incident.category,
//       network: incident.network,
//       victims: [
//         {
//           country: incident.victims_country,
//           industry: incident.victims_industry,
//           organization: incident.victims_organization,
//           site: incident.victims_site,
//         },
//       ],
//       images: [
//         {
//           description: incident.images_description,
//           url: incident.images_url,
//         },
//       ],
//     };
//   }

export const transformIncidentData = (incident) => ({
  row: new Map(Object.entries(incident)),
});