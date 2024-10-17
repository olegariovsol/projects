import { domainNameProd, domainNameDesv } from './sistemaConfig';
export const urlsServices = {
  SIGUWS: 'https://siguws.ssp.go.gov.br/',
  LEGADOWS: 'https://legadows.ssp.go.gov.br/',
  SSOWS: 'https://ssows.ssp.go.gov.br/',
  BACKENDWS: 'URLBACKENDPROD',
  BACKENDWS_OBRAS: 'https://scobews.policiacivil.go.gov.br/api/',
  //BACKENDWS_OBSERVATORIO: 'https://observatoriows.policiacivil.go.gov.br/api/',
  PORTAARQUIVO: 'https://filews-h.ssp.go.gov.br/',
};
export let ambiente = '';

if (window.location.hostname.indexOf(domainNameProd) > -1) {
  urlsServices.SIGUWS = 'https://siguws.ssp.go.gov.br/';
  urlsServices.LEGADOWS = 'https://legadows.ssp.go.gov.br/';
  urlsServices.SSOWS = 'https://ssows.ssp.go.gov.br/';
  urlsServices.BACKENDWS_OBRAS = 'https://scobews.policiacivil.go.gov.br/api/';
  urlsServices.BACKENDWS = 'https://saapws.policiacivil.go.gov.br/api/';
  /*urlsServices.BACKENDWS_OBSERVATORIO =
    'https://observatoriows.policiacivil.go.gov.br/api/';*/
  urlsServices.PORTAARQUIVO = 'https://filews.ssp.go.gov.br/';
  ambiente = 'PROD';
} else {
  urlsServices.SIGUWS = 'https://siguws-h.ssp.go.gov.br/';
  urlsServices.LEGADOWS = 'https://legadows-h.ssp.go.gov.br/';
  urlsServices.SSOWS = 'https://ssows-h.ssp.go.gov.br/';
  urlsServices.BACKENDWS_OBRAS =
    'https://scobews-homo.policiacivil.go.gov.br/api/';
  urlsServices.BACKENDWS = 'https://saapws-homo.policiacivil.go.gov.br/api/';
  /*urlsServices.BACKENDWS_OBSERVATORIO =
    'https://observatoriows-homo.policiacivil.go.gov.br/api/';*/
  urlsServices.PORTAARQUIVO = 'https://filews-h.ssp.go.gov.br/';
  ambiente = 'HOMO';
  if (window.location.hostname.indexOf(domainNameDesv) > -1) {
    //PARA DESENVOLVIMENTO
    urlsServices.BACKENDWS = 'http://localhost/api/';
    /*urlsServices.BACKENDWS_OBSERVATORIO =
      'https://observatoriows-homo.policiacivil.go.gov.br/api/';*/
    urlsServices.BACKENDWS_OBRAS =
      'https://scobews-homo.policiacivil.go.gov.br/api/';
    //urlsServices.BACKENDWS = 'http://10.6.52.27/api/';
    ambiente = 'DESV';
  }
}
/*export const urlsServicesGMOS = {
  SIGUWS: 'https://siguws.ssp.go.gov.br/',
  LEGADOWS: 'https://legadows.ssp.go.gov.br/',
  SSOWS: 'https://ssows.ssp.go.gov.br/',
  BACKENDWS: 'http://10.6.52.27/api/',
};
*/
