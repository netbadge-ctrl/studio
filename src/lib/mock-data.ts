import type { Employee, WorkOrder } from "./types";

export const employees: Employee[] = [
  { id: "emp-001", name: "Alice Johnson" },
  { id: "emp-002", name: "Bob Williams" },
  { id: "emp-003", name: "Charlie Brown" },
  { id: "emp-004", name: "Diana Prince" },
];

export const workOrders: WorkOrder[] = [
  {
    id: "wo-001",
    title: "Upgrade RAM for Hyperion-01",
    type: "Server Modification",
    status: "Assigned",
    assignedTo: [employees[0]],
    devices: [
      {
        id: "dev-001",
        serialNumber: "SN-A7B3C9D1E5",
        location: {
          module: "A1",
          rack: "R12",
          uPosition: 24,
        },
        currentConfig: [
          { type: "Memory", model: "DDR4 16GB 2400MHz", quantity: 4, partNumber: "MEM-16G-2400-A" },
          { type: "SSD", model: "Samsung PM883 480GB", quantity: 2, partNumber: "SSD-480G-S-PM883" },
        ],
        targetConfig: [
          { type: "Memory", model: "DDR4 32GB 3200MHz", quantity: 4, partNumber: "MEM-32G-3200-B" },
          { type: "SSD", model: "Samsung PM883 480GB", quantity: 2, partNumber: "SSD-480G-S-PM883" },
        ],
      },
    ],
  },
  {
    id: "wo-002",
    title: "Install new web server Titan-05",
    type: "New Server Setup",
    status: "In Progress",
    assignedTo: [employees[0], employees[2]],
    devices: [
      {
        id: "dev-002",
        serialNumber: "SN-F2G8H4I6J1",
        location: {
          module: "B2",
          rack: "R05",
          uPosition: 12,
        },
        currentConfig: [],
        targetConfig: [
            { type: "CPU", model: "Intel Xeon Silver 4210", quantity: 2, partNumber: "CPU-INT-4210"},
            { type: "Memory", model: "DDR4 32GB 3200MHz", quantity: 8, partNumber: "MEM-32G-3200-B" },
            { type: "SSD", model: "Intel P4510 1TB NVMe", quantity: 4, partNumber: "SSD-1T-I-P4510" },
            { type: "Network Card", model: "Mellanox CX-5 25GbE", quantity: 2, partNumber: "NIC-MEL-CX5" },
        ],
      },
    ],
  },
  {
    id: "wo-003",
    title: "Replace faulty switch in core network",
    type: "Switch Maintenance",
    status: "Blocked",
    assignedTo: [employees[1]],
    devices: [
        {
            id: "dev-003",
            serialNumber: "SN-K3L9M5N1P7",
            location: {
                module: "Core",
                rack: "N01",
                uPosition: 48,
            },
            currentConfig: [],
            targetConfig: [],
        }
    ],
  },
  {
    id: "wo-004",
    title: "Add SSD storage to Prometheus-03",
    type: "Server Modification",
    status: "Completed",
    assignedTo: [employees[3]],
    devices: [
      {
        id: "dev-004",
        serialNumber: "SN-Q8R4S2T7U3",
        location: {
          module: "C3",
          rack: "R21",
          uPosition: 3,
        },
        currentConfig: [
          { type: "SATA", model: "Seagate Exos 4TB", quantity: 8, partNumber: "HDD-4T-S-EXOS" },
        ],
        targetConfig: [
          { type: "SATA", model: "Seagate Exos 4TB", quantity: 8, partNumber: "HDD-4T-S-EXOS" },
          { type: "SSD", model: "Samsung PM883 960GB", quantity: 4, partNumber: "SSD-960G-S-PM883" },
        ],
      },
    ],
  },
  {
    id: "wo-005",
    title: "Decommission server Rhea-15",
    type: "Server Modification",
    status: "Pending",
    assignedTo: [],
    devices: [
      {
        id: "dev-005",
        serialNumber: "SN-V6W2X8Y4Z1",
        location: {
          module: "A1",
          rack: "R18",
          uPosition: 30,
        },
        currentConfig: [],
        targetConfig: [],
      },
    ],
  },
];
