export const contactInfo = {
  company: "SMAR s.r.o.",
  email: "info@smar.cz",
  phone: "+420 605 411 111",
  dataBox: "p85emqn",
  addressLines: ["Škroupova 1397/48", "Chomutov 43001"]
};

export const contactAddress = [
  contactInfo.company,
  ...contactInfo.addressLines
].join("\n");
