export type Employee = {
  id: string;
  name: string;
};

export type Component = {
  type: 'SATA' | 'SSD' | 'Memory' | 'Network Card' | 'CPU' | 'PSU';
  model: string;
  quantity: number;
  partNumber: string;
};

export type Device = {
  id: string;
  serialNumber: string;
  location: {
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
  type: 'Server Modification' | 'New Server Setup' | 'Switch Maintenance';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Blocked';
  assignedTo: Employee[];
  devices: Device[];
};
