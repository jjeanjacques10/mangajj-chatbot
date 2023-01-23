export default (message) => {
    const dateNow = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    console.log(`[${dateNow}] ${message}`);
}