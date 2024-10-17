import React, { useEffect, useState } from "react";
import MyChart from "../graficos/MyChart";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
  message,
  notification,
} from "antd";
import { Option } from "antd/es/mentions";
import locale from "antd/es/date-picker/locale/pt_BR";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useAuth } from "../../contexts/auth/AuthProvider";
import imgBoasvindas from "../../assets/boas_vindas.png";

const BoasVindas: React.FC = () => {
  const auth = useAuth();
  const estiloPagina: React.CSSProperties = {
    backgroundImage: `url(${imgBoasvindas})`,
    backgroundSize: "auto",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflowY: "auto" as const,
    maxHeight: "100vh", // Define a altura máxima da tela
    height: "100%", // Adiciona esta linha para garantir que a imagem cubra toda a altura
    display: "flex", // Usar flex para centralizar verticalmente
    alignItems: "center", // Centralizar verticalmente
    justifyContent: "center", // Centralizar horizontalmente
  };

  /*
ao SAAP - Sistema de Apoio à Administração Policial! Sua ferramenta
        especializada que complementa e aprimora o tratamento de informações do
        SICAD, proporcionando agilidade extraordinária. Reduzindo
        significativamente o tempo para o tratamento de dados e geração de
        documentos, o SAAP traz uma nova era de modernidade e eficiência para a
        Polícia Civil. Juntos, estamos redefinindo a excelência na administração
        de pessoal, impulsionando nosso compromisso com a inovação e a
        qualidade.
*/

  return (
    <div style={estiloPagina}>
      <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    </div>
  );
};

export default BoasVindas;
