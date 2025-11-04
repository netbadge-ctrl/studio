
export type Employee = {
  id: string;
  name: string;
};

export type Component = {
  type: 'SATA' | 'SSD' | '内存' | '网卡' | 'CPU' | 'PSU';
  manufacturer: string;
  model: string;
  quantity: 1; // Quantity is always 1, representing a single component in a slot
  partNumber: string; // Can be part number, SKU, or box number
  slot: string; // The physical slot where the component is installed
};

export type DeviceStatus = '待处理' | '改配中' | '等待配置' | '待检测' | '检测异常' | '改配完成';

export type Device = {
  id:string;
  type: '服务器';
  model: string;
  serialNumber: string;
  status: DeviceStatus;
  location?: {
    module: string;
    rack: string;
    uPosition: number;
  };
  currentConfig: Component[];
  targetConfig: Component[];
};

export type WorkOrder = {
  id: string;
  title: string;
  type: '服务器改造' | '新服务器部署' | '交换机维护' | '服务器搬迁';
  status: '待处理' | '已分配' | '进行中' | '已完成' | '已阻塞';
  assignedTo: Employee[];
  devices: Device[];
  initiator: Employee;
  createdAt: string;
  completedAt?: string; // e.g., "2024-05-23 14:00"
};

export type EmployeeWithStats = Employee & {
  activeOrders: number;
  completedToday: number;
};
