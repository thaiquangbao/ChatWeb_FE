import axios from 'axios';
const config = { withCredentials: true };
const API_URL = 'http://localhost:3050/api';
// đăng nhập / đăng ký / xác thực người dùng
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
// Token và Session
export const removeCookie = () => {
    return new Promise((reject, resolve) => {
        axios.get(`${API_URL}/users/removeCookie`, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
export const removeToken = () => {
    return new Promise((reject, resolve) => {
        axios.get(`${API_URL}/users/removeToken`, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
export const getToken = () => {
    return new Promise((reject, resolve) => {
        axios.get(`${API_URL}/users/getToken`, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
// Forgot Account
export const forgotAccount = (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/users/forgotAccount`, data, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
//delete Account
export const deleteAccount = (id) => {
    return new Promise((reject, resolve) => {
        axios.delete(`${API_URL}/users/deleteUser/${id}`, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
// update Account
export const updateAccount= (id, data) => {
    return new Promise((reject, resolve) => {
        axios.put(`${API_URL}/auth/updateUser/${id}`, data, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
export const updatePassword = (id, data) => {
    return new Promise((reject, resolve) => {
        axios.patch(`${API_URL}/auth/updatedPassword/${id}`, data, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })
}
// post Image 
export const updateImageAVT= (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/auth/updateImageAVT`, data, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
// post Image Background
export const updateImageBg= (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/auth/updateImageBg`, data, config)
            .then(res => {
                reject(res);
            })
            .catch(err => {
                resolve(err)
            })
    })

}
// Room chat
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
// find rooms
export const getRoomsById = async (id) => {
    return new Promise((reject, resolve) => {
        axios.get(`${API_URL}/rooms/${id}`,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
//delete rooms
export const deleteRooms = async (id,idRooms) => {
    return new Promise((reject, resolve) => {
        axios.delete(`${API_URL}/rooms/${id}/${idRooms}`,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
// Messages
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
// feedback messages single
export const createMessageFeedBack = async (id,data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/messages/feedBackMessages/${id}`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}
// send file
export const createMessagesFile = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/messages/updateFile`,data,config)
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
export const updateMessage = async(id, data) => {
    return new Promise((reject, resolve) => {
        axios.patch(`${API_URL}/messages/${id}/updateMessage`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
// update emoji 
export const updateEmoji = async (id,data) => {
    return new Promise((reject, resolve) => {
        axios.patch(`${API_URL}/messages/${id}/updateEmoji`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}
// Add friends
export const sendFriends = async(data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/friends`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
// accept friends
export const acceptFriends = async(id, data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/friends/accept/${id}`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
// accept friends User
export const acceptFriendsUser = async(data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/friends/acceptUser`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
//unfriends 
export const unFriends = async(id,dataSend) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/friends/unfriends/${id}`,dataSend,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
//unfriends  User
export const unFriendsUser = async(data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/friends/unfriendUser`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
//undo
export const undoFriends = async(data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/friends/undo`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
//undo user
export const undoFriendsUser = async(data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/friends/undoUser`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
// Group
export const getListGroups = () => {
    return new Promise((reject, resolve) => {
        axios.get(`${API_URL}/groups`,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err)
        })
    })
}
// get Messages from groups
export const getGroupsMessages = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/chatgroups/groups`,data ,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err)
        })
    })
}
// Create Group
export const createGroups = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/groups`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
// delete group
export const deleteGroup = async (data) => {
    return new Promise((reject, resolve) => {
        axios.delete(`${API_URL}/groups/deleteGroups/${data}`,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
//leave group
export const leaveGroup = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/groups/leaveGroups`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
//attend group
export const attendGroup = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/groups/attendGroups/`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
//create messages group
export const createMessagesGroup = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/chatgroups`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
//delete messages group
export const deleteMessagesGroups = async (id,data) => {
    return new Promise((reject, resolve) => {
        axios.delete(`${API_URL}/chatgroups/${id}/${data.idMessages}/${data.idLastMessageSent}`,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
// thu hồi messages group
export const recallMessagesGroups = async (id,data) => {
    return new Promise((reject, resolve) => {
        axios.patch(`${API_URL}/chatgroups/${id}/recallMessage`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
// feedBack messages Group
export const createMessagesGroupFeedBack = async (id,data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/chatgroups/${id}`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(err => {
            resolve(err);
        })
    })
}
// update emoji group
export const updateEmojiGroup = async (id,data) => {
    return new Promise((reject, resolve) => {
        axios.patch(`${API_URL}/chatgroups/${id}/updateEmoji`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}
// kick groups 
export const kickGroups = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/groups/kickUsersGroups`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}
// nhường nhóm trưởng groups 
export const franchiseGroups = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/groups/franchiseUsersGroups`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}
// update groups 
export const updateGroups = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/groups/updateGroups`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}
// call call
export const cancelCall = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/rooms/cancelCall`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}
export const cancelCallGroup = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/groups/groupCall`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}
export const rejectCallGroup = async (data) => {
    return new Promise((reject, resolve) => {
        axios.post(`${API_URL}/groups/rejectGroupCall`,data,config)
        .then(res => {
            reject(res);
        })
        .catch(error => {
            resolve(error)
        })
    })
}