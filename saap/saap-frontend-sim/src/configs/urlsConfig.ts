import { domainNameProdApp, domainNameDesvApp } from "./sistemaConfig";
export const urlsServices = {
  PUBLICPATHAPP: "endereço de produção",
  FRAMEWORK: "https://framework.policiacivil.go.gov.br",
  SIGUWS: "https://siguws.ssp.go.gov.br/",
  LEGADOWS: "https://legadows.ssp.go.gov.br/",
  SSOWS: "https://ssows.ssp.go.gov.br/",
  BACKENDWS: "URLBACKENDPROD",
  BACKENDWS_OBRAS: "https://scobews.policiacivil.go.gov.br/api/",
  //BACKENDWS_OBSERVATORIO: 'https://observatoriows.policiacivil.go.gov.br/api/',
  PORTAARQUIVO: "https://filews-h.ssp.go.gov.br/",
};
export let ambiente = "";

if (window.location.hostname.indexOf(domainNameProdApp) > -1) {
  urlsServices.PUBLICPATHAPP = "colocar o endereço de produção";
  urlsServices.FRAMEWORK = "https://framework.policiacivil.go.gov.br";
  urlsServices.SIGUWS = "https://siguws.ssp.go.gov.br/";
  urlsServices.LEGADOWS = "https://legadows.ssp.go.gov.br/";
  urlsServices.SSOWS = "https://ssows.ssp.go.gov.br/";
  urlsServices.BACKENDWS_OBRAS = "https://scobews.policiacivil.go.gov.br/api/";
  urlsServices.BACKENDWS = "https://saapws.policiacivil.go.gov.br/api/";
  /*urlsServices.BACKENDWS_OBSERVATORIO =
    'https://observatoriows.policiacivil.go.gov.br/api/';*/
  urlsServices.PORTAARQUIVO = "https://filews.ssp.go.gov.br/";
  ambiente = "PROD";
} else {
  urlsServices.PUBLICPATHAPP = "colocar o endereço de homologacao";
  urlsServices.FRAMEWORK = "https://framework-homo.policiacivil.go.gov.br";
  urlsServices.SIGUWS = "https://siguws-h.ssp.go.gov.br/";
  urlsServices.LEGADOWS = "https://legadows-h.ssp.go.gov.br/";
  urlsServices.SSOWS = "https://ssows-h.ssp.go.gov.br/";
  urlsServices.BACKENDWS_OBRAS =
    "https://scobews-homo.policiacivil.go.gov.br/api/";
  urlsServices.BACKENDWS = "https://saapws-homo.policiacivil.go.gov.br/api/";
  /*urlsServices.BACKENDWS_OBSERVATORIO =
    'https://observatoriows-homo.policiacivil.go.gov.br/api/';*/
  urlsServices.PORTAARQUIVO = "https://filews-h.ssp.go.gov.br/";
  ambiente = "HOMO";
  if (window.location.hostname.indexOf(domainNameDesvApp) > -1) {
    //PARA DESENVOLVIMENTO
    urlsServices.PUBLICPATHAPP = "http://localhost:3000/";
    urlsServices.FRAMEWORK = "https://framework-homo.policiacivil.go.gov.br";
    urlsServices.BACKENDWS = "http://localhost/api/";
    /*urlsServices.BACKENDWS_OBSERVATORIO =
      'https://observatoriows-homo.policiacivil.go.gov.br/api/';*/
    urlsServices.BACKENDWS_OBRAS =
      "https://scobews-homo.policiacivil.go.gov.br/api/";
    //urlsServices.BACKENDWS = 'http://10.6.52.27/api/';
    ambiente = "DESV";
  }
}
