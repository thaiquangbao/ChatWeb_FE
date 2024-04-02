import React, { useRef, useState, useContext } from 'react';
//import './update_information.scss'; // Import SCSS file
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';
import { updateAccount, updateImageBg, updateImageAVT } from '../../untills/api'
import SuccessMicroInteraction from './Success Micro-interaction.gif';


export const UpdateInformation = () => {
    const [isActive, setIsActive] = useState(false); // Cảm giác nút bấm
    const [isLoading, setIsLoading] = useState(false); // modal loading xoay xoay
    const [showSuccessModal, setShowSuccessModal] = useState(false); // modal success tick xanh uy tín



    const { user } = useContext(AuthContext);
    const [avatar, setAvatar] = useState(user.avatar);
    const [background, setBackground] = useState(user.background);
    const [name, setName] = useState(user.fullName);
    const [gender, setGender] = useState(user.gender);
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
    const navigate = useNavigate();
    const [filePathAvatar, setFilePathAvatar] = useState([])
    const [filePathBackground, setFilePathBackground] = useState([])

    const handleBackHome = () => {
        navigate('/page');
    }

    const fileInputRef = useRef(null);
    const fileInputRefBR = useRef(null);
    const handleEditAvatar = () => {
        fileInputRef.current.click();
    };
    const handleEditAvatarBR = () => {
        fileInputRefBR.current.click();
    };
    const handleFileInputChangeBR = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackground(reader.result);
            };
            reader.readAsDataURL(file);
        }
        const files = e.target.files;

        setFilePathBackground(files)
    };
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
        const files = e.target.files;
        setFilePathAvatar(files)


    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
    };

    const handleGenderChange = (e) => {
        const newGender = e.target.value;
        setGender(newGender);
    };

    const handleDateOfBirthChange = (e) => {
        const newDateOfBirth = e.target.value;
        setDateOfBirth(newDateOfBirth);
    };
    const handleUpdate = () => {
        // Xử lý khi nút "Update" được click

        setIsActive(true); // Kích hoạt hiệu ứng khi nút được click
        setIsLoading(true); // Hiển thị modal loadin



        const data = {
            fullName: name,
            dateOfBirth,
            avatar: user.avatar,
            gender,
            background: user.background,
        }
        if (filePathAvatar.length > 0 && filePathBackground.length > 0) {
            const formData3 = new FormData();
            formData3.append('fileAvatar', filePathAvatar[0]);
            const formData4 = new FormData();
            formData4.append('fileBackground', filePathBackground[0]);
            updateImageAVT(formData3)
                .then((resAvt) => {
                    updateImageBg(formData4)
                        .then((resBg) => {
                            data.avtUrl = resAvt.data
                            data.bgUrl = resBg.data;
                            updateAccount(user._id, data)
                                .then(resUpdate => {
                                    if (resUpdate.status === 200) {
                                        setTimeout(() => {
                                            setIsLoading(false); // Ẩn modal loading
                                            setShowSuccessModal(true); // Hiển thị modal thông báo thành công

                                            // Sau khi đợi 3 giây, reload trang
                                            setTimeout(() => {
                                                window.location.reload();
                                            }, 2000);
                                        }, 5000);
                                    } else {
                                        alert("Bạn không phải chủ tài khoản")
                                    }
                                })
                                .catch((err) => {
                                    alert("Lỗi upload User")
                                })
                        })
                        .catch((err) => {
                            alert("Upload ảnh nền không thành công")
                        })
                })
                .catch((err) => {
                    alert("Upload ảnh không thành công")
                })
        }
        else if (filePathAvatar.length > 0) {
            const formData1 = new FormData();
            formData1.append('fileAvatar', filePathAvatar[0]); // filePathAvatar phải là đối tượng File  
            updateImageAVT(formData1)
                .then((res) => {
                    data.avtUrl = res.data
                    updateAccount(user._id, data)
                        .then(resUpdate => {
                            if (resUpdate.status === 200) {
                                setTimeout(() => {
                                    setIsLoading(false); // Ẩn modal loading
                                    setShowSuccessModal(true); // Hiển thị modal thông báo thành công

                                    // Sau khi đợi 3 giây, reload trang
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 2000);
                                }, 5000);
                            } else {
                                alert("Bạn không phải chủ tài khoản")
                            }
                        })
                        .catch((err) => {
                            alert("Update account không thành công")
                        })
                })
                .catch((err) => {
                    console.log("Up ảnh không thành công");
                })
        } else if (filePathBackground.length > 0) {
            const formData2 = new FormData();
            formData2.append('fileBackground', filePathBackground[0]); // filePathBackground phải là đối tượng File
            updateImageBg(formData2)
                .then((res) => {
                    data.bgUrl = res.data;
                    updateAccount(user._id, data)
                        .then(resUpdate => {
                            if (resUpdate.status === 200) {
                                setTimeout(() => {
                                    setIsLoading(false); // Ẩn modal loading
                                    setShowSuccessModal(true); // Hiển thị modal thông báo thành công

                                    // Sau khi đợi 3 giây, reload trang
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 2000);
                                }, 5000);
                            } else {
                                alert("Bạn không phải chủ tài khoản")
                            }
                        })
                        .catch((err) => {
                            alert("Update account không thành công")
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            updateAccount(user._id, data)
                .then(resUpdate => {
                    if (resUpdate.status === 200) {
                        setTimeout(() => {
                            setIsLoading(false); // Ẩn modal loading
                            setShowSuccessModal(true); // Hiển thị modal thông báo thành công

                            // Sau khi đợi 3 giây, reload trang
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        }, 5000);
                    } else {
                        alert("Bạn không phải chủ tài khoản")
                    }
                })
                .catch((err) => {
                    alert("Update account không thành công")
                })
        }



    };

    return (
        <div className='update-wrapper' >
            <div className='update-section-one' >
                <div className="title-section-one">
                    <i className='bx bx-left-arrow-alt' onClick={handleBackHome} style={{ fontSize: '40px', paddingRight: '60px' }}></i>
                    <h2 style={{ paddingRight: '100px' }}>Action</h2>
                </div>
                <div className="list-section-one">
                    <Link to={`/update_information/${user._id}`}> <p className='p-update-information' style={{ color: 'orange' }}>Update Information</p></Link>
                    <Link to={`/update_password/${user._id}`}><p className='p-update-password' style={{ color: 'black' }}>Update Password</p></Link>
                    <Link to={`/delete_account/${user._id}`}><p className='delete-account'>❌ DELETE ACCOUNT</p></Link>

                </div>
            </div>

            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '200px' }} >
                    <div >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <p>Background</p>
                            <input type="file" ref={fileInputRefBR} style={{ display: 'none' }} onChange={handleFileInputChangeBR} />
                            <div>
                                <img src={background} alt="" style={{ width: '250px', border: '1px solid black' }} />
                            </div>
                            <button style={{ margin: '20px', background: 'linear-gradient(150deg, rgb(224, 143, 83), rgb(215, 119, 75))', padding: '2px 0', borderRadius: '5px' }} type="button" onClick={handleEditAvatarBR}>
                                <i className='bx bx-edit-alt'></i>
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <p>Avatar</p>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileInputChange} />
                            <div>
                                <img src={avatar} alt="" style={{ width: '250px', border: '1px solid black' }} />
                            </div>
                            <button style={{ margin: '20px', background: 'linear-gradient(150deg, rgb(224, 143, 83), rgb(215, 119, 75))', padding: '2px 0', borderRadius: '5px' }} type="button" onClick={handleEditAvatar}>
                                <i className='bx bx-edit-alt'></i>
                            </button>
                        </div>
                    </div>
                    <div style={{ width: '400px', marginLeft: '100px' }}>
                        <h1 style={{ color: 'orange' }}>Update Information</h1>
                        <p style={{ fontWeight: 'bold' }}>Name</p>
                        <input type="text" value={name} onChange={handleNameChange} style={{ width: '100%', padding: '10px 0', borderRadius: '5px' }} />
                        <br />
                        <p>Gender</p>
                        <select value={gender} onChange={handleGenderChange} style={{ width: '100%', padding: '10px 0', borderRadius: '5px' }}>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                        <p>Date of Birth</p>
                        <input type="date" value={dateOfBirth} onChange={handleDateOfBirthChange} style={{ width: '100%', padding: '10px 0', borderRadius: '5px' }} />
                        <p>Email</p>
                        <input type="text" value={user.email} onChange={handleDateOfBirthChange} disabled style={{ width: '100%', padding: '10px 0', borderRadius: '5px' }} />
                        <p>Number phone</p>
                        <input type="text" value={user.phoneNumber} onChange={handleDateOfBirthChange} style={{ width: '100%', padding: '10px 0', borderRadius: '5px' }} disabled />
                        <div style={{ position: 'relative' }}>

                            <button
                                onClick={handleUpdate}
                                style={{
                                    background: isActive ? 'rgb(200, 100, 50)' : 'linear-gradient(150deg, rgb(255, 168, 73), rgb(241, 116, 78), rgb(224, 86, 54), rgb(231, 152, 71), rgb(247, 194, 94))',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '5px',
                                    width: '100%',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    margin: '0',
                                    padding: '10px 20px',
                                    marginTop: '20px',
                                    transition: 'background-color 0.3s ease',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                Update
                            </button>
                            {isActive && (
                                <div className="modal-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                                    <div className="modal" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '40px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.3s forwards', position: 'relative', width: '25%', height: '15%' }}>
                                        {isLoading ? (
                                            <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <p style={{ marginBottom: '40px', fontSize: '20px' }}>Đợi chút nha, sắp xong rồi</p>
                                                <div className="loader" style={{ border: '6px solid #f3f3f3', borderTop: '6px solid #3498db', borderRadius: '50%', width: '60px', height: '60px', animation: 'spin 1s linear infinite' }}></div>
                                            </div>
                                        ) : showSuccessModal ? (
                                            <div className="modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <p>Cập nhật thông tin của {user.fullName} thành công!</p>
                                                <img src={SuccessMicroInteraction} alt="Success Micro Interaction" style={{ width: '190px', height: '120px' }} />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}


                        </div>

                    </div>
                </div>

            </div>
        </div >
    )
}

export default UpdateInformation;
