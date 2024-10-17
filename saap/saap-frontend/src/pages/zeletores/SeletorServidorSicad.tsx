import { useRef, useState } from 'react';
import { useAxiosSICAD } from '../../hooks/useAxiosSICAD';
import { Form, Input, Button, Row, Col, Space, notification, Spin } from 'antd';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Tooltip } from 'antd/lib';
import dayjs from 'dayjs';

interface Props {
  form: any; // Modifiquei o nome da prop para "form" para ser compatível com o restante do código
  index: string;
  xlabel: string;
  xobrigatorio: boolean;
  xtooltip: string;
}

const SeletorServidorSicadComponent: React.FC<Props> = ({
  form,
  index,
  xlabel,
  xobrigatorio,
  xtooltip,
}) => {
  const apiSICAD = useAxiosSICAD();
  const autoCompleteServidor = useRef(null);
  const [showOptionsServidor, setShowOptionsServidor] = useState(false);
  const [listaServidor, setListaServidor] = useState<
    { id: number; key: number; nome: string }[]
  >([]);

  /**************************************************************************
   * **********************************LOAD****************************
   * ************************************************************************/
  const [openLoadSeletor, setOpenLoadSeletor] = useState(false);
  const [messageLoadSeletor, setMessageLoadSeletor] = useState('');

  const onLoadSeletor = (message: string) => {
    setMessageLoadSeletor(message);
    setOpenLoadSeletor(true);
  };

  const exitLoadSeletor = () => {
    setOpenLoadSeletor(false);
    setMessageLoadSeletor('');
  };

  const ListServidores = async (value: string) => {
    if (value.length < 3) {
      notification.info({
        message:
          'Informe pelo menos 3 caracteres para realizar a pesquisa de servidor.',
      });
    } else {
      onLoadSeletor('Minutinho só por favor...');

      await apiSICAD.servidoresPCPorNome(value).then((response: any) => {
        const sortedData = response.data.sort(
          (a: any, b: any) =>
            a.funcao.localeCompare(b.funcao) || a.nome.localeCompare(b.nome),
        );

        const servidorMap: Record<string, any> = {};

        sortedData.forEach((item: any) => {
          if (!servidorMap[item.funcao]) {
            servidorMap[item.funcao] = {
              label: item.funcao,
              value: item.funcao,
              id: item.funcao,
              key: item.funcao,
              options: [],
            };
            // console.log('Category: '+item.status);
          }

          /*
                            const segundosDesdeEpoca = item.dtNascimento;
                            const milissegundosDesdeEpoca = segundosDesdeEpoca * 1000; // Converta para milissegundos
                            const dataFormatada = dayjs(milissegundosDesdeEpoca).locale('pt-br').format('DD/MM/YYYY');
                            const dataFormatada1 = dayjs(item.dtNascimento / 1000).locale('pt-br').format('DD/MM/YYYY');
                            const dataFormatada0 = dayjs(item.dtNascimento).locale('pt-br').format('DD/MM/YYYY');

                            console.log(dataFormatada0, item.nome);*/

          const dataPosse = dayjs(item.dtPosse)
            .locale('pt-br')
            .format('DD/MM/YYYY');
          const dataLotacao = dayjs(item.dtInicioLotacao)
            .locale('pt-br')
            .format('DD/MM/YYYY');
          const dataNascimento = dayjs(item.dtNascimento)
            .locale('pt-br')
            .format('DD/MM/YYYY');
          //console.log(dataPosse + ' - ' + dataLotacao + ' - ' + dataNascimento, item.nome);

          servidorMap[item.funcao].options.push({
            label: item.nome,
            value: item.nome,
            id: item.id,
            key: item.id,
            funcao: item.funcao,
            cpf: item.cpf,
            title: item.lotacaoSigla,
            cargo_funcao: item.funcao,
            cargo: item.postoGrad,
            sexo: item.sexo,
            lotacao: item.lotacao,
            lotacao_id: item.lotacaoId,
            lotacao_dta: dataLotacao,
            cidade_id: item.municipioIdLotacao,
            cidade: item.municipioLotacao,
            status: item.status,
            situacao: item.situacao,
            posse_dta: dataPosse,
            nascimento: dataNascimento,
          });
        });

        const newServidor = Object.values(servidorMap);
        setListaServidor(newServidor);

        setShowOptionsServidor(true);

        return true;
      });

      exitLoadSeletor();
    }
  };

  const onSelectServidores = (data: any) => {
    form.setFieldValue('servidor_id_' + index, data.id);
    if (data.sexo == 'M') {
      form.setFieldValue('servidor_genero_' + index, 'MASCULINO');
    } else {
      form.setFieldValue('servidor_genero_' + index, 'FEMININO');
    }
    form.setFieldValue('servidor_cpf_' + index, data.cpf);
    form.setFieldValue('servidor_cargo_' + index, data.cargo);
    form.setFieldValue('servidor_funcao_' + index, data.cargo_funcao);
    form.setFieldValue('servidor_lotacao_' + index, data.lotacao);
    form.setFieldValue('servidor_lotacao_id_' + index, data.lotacao_id);
    //form.setFieldValue("nascimento", dayjs(data.nascimento));
    form.setFieldValue('servidor_dta_nascimento_' + index, data.nascimento);
    form.setFieldValue('servidor_lotacao_dta_' + index, data.lotacao_dta);
    form.setFieldValue('servidor_dta_inicio_' + index, data.posse_dta);

    // Parse a data de nascimento usando o formato adequado
    const xdta_exp = data.nascimento.split('/'); //gambiarra para funcionar kkkk
    const dataNascimentoFormatada = dayjs(
      xdta_exp[1] + '/' + xdta_exp[0] + '/' + xdta_exp[2],
      { format: 'DD/MM/YYYY' },
    );
    const dataAtual = dayjs();

    const diferenca = dayjs.duration(dataAtual.diff(dataNascimentoFormatada));

    const anos = diferenca.years();
    /*const meses = diferenca.months();
    const dias = diferenca.days();*/

    form.setFieldValue('servidor_idade_' + index, anos);
  };

  const handleEnterPressServidor = (e: any) => {
    if (e.key === 'Enter') {
      ListServidores(form.getFieldValue('servidor_' + index));
    }
  };

  function listaServidoresClick() {
    ListServidores(form.getFieldValue('servidor_' + index));
  }

  function clearServidor() {
    form.setFieldsValue({
      [`servidor_id_${index}`]: '',
      [`servidor_${index}`]: '',
      [`servidor_genero_${index}`]: '',
      [`servidor_cpf_${index}`]: '',
      [`servidor_cargo_${index}`]: '',
      [`servidor_lotacao_${index}`]: '',
      [`servidor_lotacao_id_${index}`]: '',
      [`servidor_dta_nascimento_${index}`]: '',
      [`servidor_lotacao_dta_${index}`]: '',
      [`servidor_dta_inicio_${index}`]: '',
      [`servidor_idade_${index}`]: '',
      [`servidor_funcao_${index}`]: '',
    });
  }

  return (
    <Spin spinning={openLoadSeletor} tip={messageLoadSeletor}>
      {/*campos retornados do sicad*/}
      <Form.Item hidden name={`servidor_id_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_genero_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_cpf_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_cargo_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_lotacao_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_lotacao_id_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_dta_nascimento_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_lotacao_dta_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_dta_inicio_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_idade_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_funcao_${index}`}>
        <Input />
      </Form.Item>

      {/*campos retornados do sicad*/}

      <Col span={5} style={{ paddingRight: 5 }}>
        <Space.Compact>
          <Tooltip trigger={['hover']} title={xtooltip} placement="top">
            <Form.Item
              name={`servidor_${index}`}
              label={`${xlabel}:`}
              rules={[
                {
                  required: xobrigatorio,
                  message: 'Informe o servidor!',
                },
              ]}
            >
              <AutoComplete
                ref={autoCompleteServidor}
                key={listaServidor.length} // Chave única com base no tamanho do array
                options={listaServidor}
                style={{ width: 260 }}
                dropdownMatchSelectWidth={false} // Desative o ajuste automático
                dropdownStyle={{ width: 800 }}
                onSelect={(value, option) => {
                  onSelectServidores(option);
                  setShowOptionsServidor(false); // Fecha a lista após a seleção
                }}
                onKeyDown={handleEnterPressServidor} // Adicione este evento para verificar a tecla Enter
                onDropdownVisibleChange={visible =>
                  setShowOptionsServidor(visible)
                } // Controla a visibilidade da lista
                open={showOptionsServidor} // Controla a visibilidade da lista
                placeholder="Digite o nome de um Servidor"
              >
                <Input
                  style={{ fontSize: 11, height: 32 }}
                  onInput={e =>
                    ((e.target as HTMLInputElement).value = (
                      e.target as HTMLInputElement
                    ).value.toUpperCase())
                  }
                  className="bold-text-input"
                />
              </AutoComplete>
            </Form.Item>
          </Tooltip>
          <Button
            type="primary"
            onClick={listaServidoresClick}
            style={{ marginTop: 30 }}
            icon={<SearchOutlined />}
          ></Button>
          <Button
            title="Limpar Campo"
            onClick={clearServidor}
            style={{ marginTop: 30 }}
            icon={<ClearOutlined />}
          ></Button>
        </Space.Compact>
      </Col>
    </Spin>
  );
};

export default SeletorServidorSicadComponent;
