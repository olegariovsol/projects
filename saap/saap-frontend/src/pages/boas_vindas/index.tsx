import React, { useEffect, useState } from 'react';
import MyChart from '../graficos/MyChart';
import { useAxiosServidor } from '../../hooks/useAxiosServidor';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tooltip,
  message,
  notification,
} from 'antd';
import { Option } from 'antd/es/mentions';
import locale from 'antd/es/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useAxiosServidorAtribuicao } from '../../hooks/useAxiosServidorAtribuicao';
import * as XLSX from 'xlsx';

const BoasVindas: React.FC = () => {
  const auth = useAuth();
  const apiServidorAtribuicao = useAxiosServidorAtribuicao();

  const [openLoadDados, setopenLoadDados] = useState(false);
  const [messageLoadDados, setmessageLoadDados] = useState('');

  const onLoadDados = (message: string) => {
    setmessageLoadDados(message);
    setopenLoadDados(true);
  };

  const exitLoadDados = () => {
    setopenLoadDados(false);
    setmessageLoadDados('');
  };
  const [form_departamentos] = Form.useForm();

  const [linhaSinc, setLinhaSinc] = useState(false);
  useEffect(() => {
    if (auth?.user?.cpf == '87299372134') {
      setLinhaSinc(true);
    } else {
      setLinhaSinc(false);
    }
  }, []);

  const estiloPagina: React.CSSProperties = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/boas_vindas.png)`,
    backgroundSize: 'auto',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflowY: 'auto' as const,
    minHeight: '100vh', // Define a altura máxima da tela
    height: '100%', // Adiciona esta linha para garantir que a imagem cubra toda a altura
    display: 'flex', // Usar flex para centralizar verticalmente
    flexDirection: 'column', // Alinha os itens na vertical
  };

  return (
    <div style={estiloPagina}>
      <div style={{ width: '100%', padding: '20px' }}>
        <p>
          ao SAAP - Sistema de Apoio à Administração Policial! Sua ferramenta
          especializada que complementa e aprimora o tratamento de informações
          do SICAD, proporcionando agilidade extraordinária. Reduzindo
          significativamente o tempo para o tratamento de dados e geração de
          documentos, o SAAP traz uma nova era de modernidade e eficiência para
          a Polícia Civil. Juntos, estamos redefinindo a excelência na
          administração de pessoal, impulsionando nosso compromisso com a
          inovação e a qualidade.
        </p>
      </div>

      <div style={{ width: '100%', padding: '20px' }}></div>
    </div>
  );
};

export default BoasVindas;
