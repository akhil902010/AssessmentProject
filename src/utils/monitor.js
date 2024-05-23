import os from 'os';

function getCPUUsage() {
  const cpus = os.cpus();

  let idleMs = 0;
  let totalMs = 0;

  cpus.forEach((core) => {
    for (let type in core.times) {
      totalMs += core.times[type];
    }
    idleMs += core.times.idle;
  });

  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
    usage: (1 - idleMs / totalMs) * 100, // Usage as a percentage
  };
}

export default getCPUUsage;   