import axios from 'axios';
const config = { withCredentials: true };
const API_URL = 'http://localhost:3050/api';
export const postEmail = async (data) => {

    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/auth/sendMail`, data, config)
            .then(res => {
                reject(res)
            })
            .catch(err => {
                resolve(err);
            })
    })


}
export const postRegister = async (data) => {
    const res = axios.post(`${API_URL}/auth/register`, data, config)
    return res;
}
export const postValidRegister = async (data) => {

    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/auth/statusValid`, data, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
export const postLogin = async (data) => {

    return new Promise((rejects, resolve) => {
        axios.post(`${API_URL}/auth/login`, data, config)
            .then(res => {
                rejects(res)
            })
            .catch(err => {
                resolve(err)
            })
    })

}
export const logoutUser = () =>{
    return new Promise((reject, resolve) => { 
        axios.post(`${API_URL}/auth/logout`, {}, config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
     
};
export const getAuthUser = () => {
    return axios.get(`${API_URL}/auth/status`, config)
}
export const getCookieExist = () => {

    return axios.get(`${API_URL}/auth/checkCookie`, config)

}
export const removeCookie = () => {
    return new Promise((reject, resolve) => {
        axios.get(`${API_URL}/auth/removeCookie`, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
// thay đổi chổ này
export const getListRooms = () => {
    return new Promise((reject, resolve) => {
        axios.get(`${API_URL}/rooms`,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err)
        })
    })
}
export const getRoomsMessages = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/messages/room`,data ,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err)
        })
    })
}
export const createMessage = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/messages`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}
export const findAuth = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/auth/findAuth`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
export const createRooms = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/rooms`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
export const deleteMessages = async (id,data) => {
    return new Promise((reject, resolve) => {
        axios.delete(`${API_URL}/messages/${id}/${data.idMessages}/${data.idLastMessageSent}/${data.email}`,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}