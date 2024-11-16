import paypal from "paypal-rest-sdk";

paypal.configure({
  mode: "sandbox", // Change to 'live' for production
  client_id: "AXqTo3Rw_wnrK8hXEAJnPYJxg_8Ab-bdScpo7xq-UIV6qYbhxNDGq5Ij05mz6jLdZDLbr6ZG_B8HREHF",
  client_secret: "EGQRy62JZi2DQQ6I0BMgsKPYxWlkMTHvJmrhpq_N0flzPc6Tt7n88epaZhKks0ss_do2BXVhb1aFFf_P",
});

export default paypal;
