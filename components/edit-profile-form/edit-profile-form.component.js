import { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import { renderDatePickerHeader } from '../datepicker/datepicker.component';
import "react-datepicker/dist/react-datepicker.css";
import Avatar from "../images/avatar.component";
import classes from "../edit-profile-form/edit-profile-form.module.scss";
import UploadedImage from "../images/uploaded.component";
import {getUserAuth} from "../../helpers/get-user-authenticated";

const createProfile = async (userProfileParamObj) => {
    const response = await fetch('/api/user/users', {
        method: 'POST',
        body: JSON.stringify(userProfileParamObj),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }

    return data;
}

const EditProfileForm = () => {
    const bioInputRef = useRef();
    const cityInputRef = useRef();
    const relationshipInputRef = useRef();

    const router = useRouter()

    // Date picker birthdate state
    const [birthDate, setBirthDate] = useState(new Date());

    // User authenticated state
    const [userIn, setUserIn] = useState([]);

    let birthDateFormat;
    if (birthDate) {
        birthDateFormat = birthDate.toUTCString();
    }

    // Get current authenticated user info
    useEffect(() => {
        const user = getUserAuth();
        user.then((dataUser) => {
            setUserIn(dataUser);
        });
    },[]);

    // Cloudinary image upload state
    const [profilePic, setProfilePic] = useState('');
    const [uploadedPhotosState, setUploadedPhotosState] = useState([]);
    useEffect(() => {
        if (userIn.length) {
            setUploadedPhotosState(userIn[0].uploadedPhotos);
        }
    },[userIn]);

    // File upload to Cloudinary
    const handleUploadInput = async (e) => {
        const files = [...e.target.files];
        const formData = new FormData();

        for (let file of files) {
            formData.append("file", file);
        }

        formData.append("upload_preset", "fambook-uploads");

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/djlylmmfn/image/upload",
            {
                method: "POST",
                body: formData,
            }
        );
        const data = await response.json();

        // If the uploaded photo is the profile picture
        if (e.target.id === 'profilePicture') {
            setProfilePic(data.secure_url);
        } else {
            const uploadedPicFullId = e.target.id;
            const uploadedPicIndex = uploadedPicFullId.substring(6);

            // If there are already photos from the db upload and replace
            if (userIn.length && userIn[0].uploadedPhotos && userIn[0].uploadedPhotos.length) {
                setUploadedPhotosState(
                    uploadedPhotosState.map((item, index) => {
                        return index === +uploadedPicIndex
                            ? data.secure_url
                            : item;
                    }));
            } else {
                // Else there are no photos at all and just upload them
                const updatedUploads = [...uploadedPhotosState];
                updatedUploads[uploadedPicIndex] = data.secure_url;
                setUploadedPhotosState(updatedUploads);
            }
        }

        //console.log('upload url', data.secure_url);

    };

    //console.log('upload state', uploadedPhotosState);

    // Set variables for what i need from the user object. Check if user object exists and if the respective property exists
    const userInProfileId = userIn.length && userIn[0].profileId ? userIn[0].profileId : '';
    const userInProfilePic = userIn.length && userIn[0].profilePicture ? userIn[0].profilePicture : '';
    const userInBio = userIn.length && userIn[0].bio ? userIn[0].bio : '';
    const userInCity = userIn.length && userIn[0].city ? userIn[0].city : '';
    const userInStatus = userIn.length && userIn[0].relationship_status ? userIn[0].relationship_status : '';

    let userInUploadedPhotos = [];
    if (userIn.length && userIn[0].uploadedPhotos && userIn[0].uploadedPhotos.length) {
        userIn[0].uploadedPhotos.forEach((item, index) => {
            userInUploadedPhotos[index] = item
        })
    }


    // Submit the form logic
    const submitHandler = async (event) => {
        event.preventDefault();

        // Get bio and city input values
        const enteredBio = bioInputRef.current.value;
        const enteredCity = cityInputRef.current.value;
        const selectedRelationship = relationshipInputRef.current.value;

        const userProfileObj = {
            profilePic: !profilePic ? userInProfilePic : profilePic,
            bio: !enteredBio ? userInBio: enteredBio,
            city: !enteredCity ? userInCity : enteredCity,
            birthdate: birthDateFormat,
            relationship: !selectedRelationship ? userInStatus : selectedRelationship,
            uploadedPhotos: !uploadedPhotosState ? userInUploadedPhotos : uploadedPhotosState
        };

        // Add validation. We have validation on the api route but we can add here also to not stress the server

        try {
            const result = await createProfile(userProfileObj);
            router.push(`/${userInProfileId}`);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="content">
            <form onSubmit={submitHandler}>
                <div className={`${classes['f-row']} form-control`}>
                    <h4 className={classes['gen-title']}>Profile picture</h4>
                    <label
                        className="form-control-upload"
                        htmlFor='profilePicture'>
                        <Avatar src={!profilePic ? userInProfilePic : profilePic} />
                        <input
                            type='file'
                            onChange={handleUploadInput}
                            id='profilePicture'
                            accept="image/*" />
                    </label>
                </div>
                <div className={`${classes['f-row']} form-control`}>
                    <label htmlFor='bio'>Bio</label>
                    <textarea
                        className="form-control-field"
                        id='bio'
                        placeholder={userInBio}
                        ref={bioInputRef}
                        rows={10} />
                </div>

                <div className="row">
                    <div className={`${classes['f-row']} col-3 form-control`}>
                        <label htmlFor='city'>Current city</label>
                        <input
                            className="form-control-field"
                            type='text'
                            id='city'
                            placeholder={userInCity}
                            ref={cityInputRef} />
                    </div>
                    <div className={`${classes['f-row']} col-3 form-control`}>
                        <label htmlFor='dateofbirth'>Date of birth</label>
                        <DatePicker
                            renderCustomHeader={renderDatePickerHeader}
                            selected={birthDate}
                            onChange={(date) => setBirthDate(date)}
                            placeholderText="Click to enter your birthday"
                            dateFormat="dd/MM/yyyy"
                            className="form-control-field"
                        />
                    </div>
                    <div className={`${classes['f-row']} col-3 form-control`}>
                        <label htmlFor='relationship'>Relationship status</label>
                        <select className="form-control-field form-control-dropdown" id="relationship" ref={relationshipInputRef}>
                            <option value="">{!userInStatus ? 'Status': userInStatus}</option>
                            <option value="Single">Single</option>
                            <option value="In a relationship">In a relationship</option>
                            <option value="Engaged">Engaged</option>
                            <option value="Married">Married</option>
                            <option value="In a civil union">In a civil union</option>
                            <option value="In a domestic partnership">In a domestic partnership</option>
                            <option value="In an open relationship">In an open relationship</option>
                            <option value="It's complicated">It's complicated</option>
                            <option value="Separated">Separated</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </div>
                </div>

                <h4 className={classes['gen-title']}>Upload photos (max 4 photos)</h4>
                <div className="row">
                    <div className="col-4 form-control">
                        <label
                            className="form-control-upload"
                            htmlFor='image-0'>
                            <UploadedImage src={!uploadedPhotosState[0] ? userInUploadedPhotos[0] : uploadedPhotosState[0]} />
                            <input
                                type='file'
                                onChange={handleUploadInput}
                                id='image-0'
                                accept="image/*" />
                        </label>
                    </div>
                    <div className="col-4 form-control">
                        <label
                            className="form-control-upload"
                            htmlFor='image-1'>
                            <UploadedImage src={!uploadedPhotosState[1] ? userInUploadedPhotos[1] : uploadedPhotosState[1]} />
                            <input
                                type='file'
                                onChange={handleUploadInput}
                                id='image-1'
                                accept="image/*" />
                        </label>
                    </div>
                    <div className="col-4 form-control">
                        <label
                            className="form-control-upload"
                            htmlFor='image-2'>
                            <UploadedImage src={!uploadedPhotosState[2] ? userInUploadedPhotos[2] : uploadedPhotosState[2]} />
                            <input
                                type='file'
                                onChange={handleUploadInput}
                                id='image-2'
                                accept="image/*" />
                        </label>
                    </div>
                    <div className="col-4 form-control">
                        <label
                            className="form-control-upload"
                            htmlFor='image-3'>
                            <UploadedImage src={!uploadedPhotosState[3] ? userInUploadedPhotos[3] : uploadedPhotosState[3]} />
                            <input
                                type='file'
                                onChange={handleUploadInput}
                                id='image-3'
                                accept="image/*" />
                        </label>
                    </div>
                </div>

                <div className="form-button-wrapper">
                    <button className="btn btn-primary btn-font-large">Save changes</button>
                </div>
            </form>
        </div>
    );
};


export default EditProfileForm;