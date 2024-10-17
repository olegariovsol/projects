export const sistemaNameSSO = 'SAAP';
export const sistemaDescricao = 'Sistema de Apoio à Administração Policial';
export const sistemaVersao = '1.0.0-00';
export const domainNameProd = 'saap.policiacivil.go.gov.br';
export const domainNameHomo = 'saap-homo.policiacivil.go.gov.br';
export const domainNameDesv = 'localhost';

export const perfisSistema = {
  SAAP_ANALISTA_APOSENTADORIA: 'SAAP_ANALISTA_APOSENTADORIA',
  RH: 'RH',
  REGIONAL: 'REGIONAL',
  ADMIN: 'ADMIN',
};

export const getConfig = (type: string) => {
  const configPub = {
    headers: {
      'Access-Control-Allow-Origin': `${window.location.origin}`,
      'Access-Control-Allow-Methods': '*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const configPriv = {
    headers: {
      'Access-Control-Allow-Origin': `${window.location.origin}`,
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token_sso')}`,
      Token: localStorage.getItem('token_sso'),
    },
  };

  if (type === 'priv') {
    return configPriv;
  }
  return configPub;
};

export const getConfigLaravel = (type: string) => {
  const configPub = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': '*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const configPriv = {
    headers: {
      'Access-Control-Allow-Origin': window.location.origin,
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': '*',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('token_sso')}`,
      Tenant: `${localStorage.getItem('localId')}`,
      Token: `${localStorage.getItem('token_sso')}`,
    },
  };
  const configPubFile = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': '*',
      'Content-Type': 'multipart/form-data',
    },
  };
  const configPrivFile = {
    headers: {
      'Access-Control-Allow-Origin': window.location.origin,
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTION',
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token_sso')}`,
      Tenant: `${localStorage.getItem('localId')}`,
      Token: `${localStorage.getItem('token_sso')}`,
    },
  };
  const configPortaArquivo = {
    headers: {
      'Access-Control-Allow-Origin': window.location.origin,
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTION',
      'Content-Type':
        'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      Authorization: `Bearer ${localStorage.getItem('token_sso')}`,
      Token: `${localStorage.getItem('token_sso')}`,
    },
  };

  if (type === 'priv') {
    return configPriv;
  } else if (type === 'pub') {
    return configPub;
  } else if (type === 'privF') {
    return configPrivFile;
  } else if (type === 'pubF') {
    return configPubFile;
  } else if (type === 'file') {
    return configPortaArquivo;
  }
  //return configPub;
};
