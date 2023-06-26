import Image from "next/image";
import { IMAGE } from "../../lib/constants";

const Logo = (props) => {
  return (
    <Image
      src={IMAGE.LOGO.PATH}
      width={IMAGE.LOGO.WIDTH}
      height={IMAGE.LOGO.HEIGHT}
      alt={IMAGE.LOGO.ALT}
      {...props}
    />
  );
};

export default Logo;
