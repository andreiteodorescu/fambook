import Image from "next/image";
import classes from "./uploaded.module.scss";

const UploadedImage = (props) => {
    return <div className={classes.uimg}>
        <Image
            src={!props.src ? '/images/placeholder-image-generic.jpg' : props.src}
            alt=""
            quality={100}
            layout="fill"
            objectFit="contain"
        />
    </div>
};

export default UploadedImage;