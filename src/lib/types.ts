export type Employee = {
  id: string;
  name: string;
};

export type Component = {
  type: 'SATA' | 'SSD' | '内存' | '网卡' | 'CPU' | 'PSU';
  manufacturer: string;
  model: string;
  quantity: number;
  partNumber: string;
};

export type SOPStep = {
  step: number;
  action: string;
  completed: boolean;
};

export type Device = {
  id: string;
  type: '服务器' | '交换机' | '存储设备';
  model: string;
  serialNumber: string;
  location: {
    module: string;
    rack: string;
    uPosition: number;
  };
  currentConfig: Component[];
  targetConfig: Component[];
  sop: SOPStep[];
};

export type WorkOrder = {
  id: string;
  title: string;
  type: '服务器改造' | '新服务器部署' | '交换机维护';
  status: '待处理' | '已分配' | '进行中' | '已完成' | '已阻塞';
  assignedTo: Employee[];
  devices: Device[];
};
