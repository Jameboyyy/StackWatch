import si from 'systeminformation';

export const fetchMetrics = async () => {
    const cpuLoad = await si.currentLoad();
    const memory = await si.mem();
    const disks = await si.fsSize();
    const networkInterfaces = await si.networkInterfaces();
    const networkStats = await si.networkStats();

    return {
        cpu: {
            usage: cpuLoad.currentLoad,
        },
        memory: {
            used: memory.used / (1024 ** 3),
            free: memory.available / (1024 ** 3),
            total: memory.total / (1024 ** 3),
            usage: (memory.used / memory.total) * 100,
        },
        disk: disks.map((disk) => ({
            filesystem: disk.fs,
            used: disk.used / (1024 ** 3),
            free: disk.available / (1024 ** 3),
            total: disk.size / (1024 ** 3),
            usage: disk.use,
        })),
        network: {
            interfaces: networkInterfaces.map((net) => ({
                name: net.iface,
                ip: net.ip4,
                mac: net.mac,
                speed: net.speed,
                internal: net.internal,
                status: net.operstate,
            })),
            stats: networkStats.map((stat) => ({
                interface: stat.iface,
                rx_bytes: stat.rx_bytes,
                tx_bytes: stat.tx_bytes,
            })),
        },
    };
};