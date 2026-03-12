export const getUser = () => {
    return {
        nama: localStorage.getItem("user_nama"),
        sekolah: localStorage.getItem("user_sekolah"),
    };
};

export const getTransactions = (nama) => {
    const key = `riwayat_${nama}`;
    return JSON.parse(localStorage.getItem(key) || "[]");
};

export const saveTransaction = (nama, data) => {
    const key = `riwayat_${nama}`;
    const lama = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify([...lama, data]));
};

export const getTarget = () => {
    return Number(localStorage.getItem("target_tabungan")  || 0);
};

export const setTarget = (value) => {
    localStorage.setItem("target_tabungan", value);
};