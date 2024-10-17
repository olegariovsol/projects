import {
  BankOutlined,
  StarOutlined,
  DesktopOutlined,
  UserSwitchOutlined,
  FolderViewOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import { perfisSistema } from '../../configs/sistemaConfig';

export const menus = [
  {
    label: 'Bem Vindo',
    key: '1',
    icon: <StarOutlined />,
    link: '/boas_vindas',
    perfis: [
      perfisSistema.SAAP_ANALISTA_APOSENTADORIA,
      perfisSistema.ADMIN,
      perfisSistema.REGIONAL,
      perfisSistema.RH,
    ],
    children: [],
  },
  /*{
    label: 'Dashboard',
    key: '2',
    icon: <DesktopOutlined />,
    link: '/dashboard',
    perfis: [perfisSistema.SAAP_ANALISTA_APOSENTADORIA],
    children: [],
  },
  {
    label: 'Aposentadoria',
    key: '3',
    icon: <UserSwitchOutlined />,
    link: '/aposentadoria',
    perfis: [perfisSistema.RH, perfisSistema.ADMIN,
      perfisSistema.SAAP_ANALISTA_APOSENTADORIA],
    children: [],
  },*/
  {
    label: 'Gestão',
    key: '3',
    icon: <ControlOutlined />,
    link: '/unidade',
    perfis: [
      perfisSistema.SAAP_ANALISTA_APOSENTADORIA,
      perfisSistema.ADMIN,
      perfisSistema.REGIONAL,
      perfisSistema.RH,
    ],
    children: [],
  },
];
