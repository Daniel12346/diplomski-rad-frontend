import { useEffect, useState } from "react";
import getPersonThumbnail from "../functions/getPersonThumbnail";
import { Image } from "@chakra-ui/react";

type PersonThumbnailProps = {
  name: string;
};
const PersonThumbnail = ({ name }: PersonThumbnailProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  useEffect(() => {
    const setThumbnail = async () => {
      const response = await getPersonThumbnail(name);
      const thumbnail = response?.data?.thumbnail;
      thumbnail && setImageSrc(thumbnail);
    };
    setThumbnail();
  }, [name]);
  if (!name || !imageSrc) {
    return null;
  }
  return (
    imageSrc && (
      <Image
        boxSize="70px"
        objectFit={"cover"}
        src={imageSrc}
        alt={name}
        borderRadius={"20%"}
      />
    )
  );
};

export default PersonThumbnail;
