import Image from "next/image";
import classes from "./avatar.module.scss";

const Avatar = (props) => {
    return <Image
            className={classes.avatar}
            src={!props.src ? '/images/profile_picture_avatar.png' : props.src}
            alt="Avatar image"
            width="140px"
            height="140px"
            quality={100}
        />
};

export default Avatar;