import Image2 from "../assets/basket.jpg";
import Image1 from "../assets/Gym.jpg";
import logo from "../assets/logo.png";
import notfound from "../assets/404.svg";
import debit from "../assets/debit.svg";
import network from "../assets/network.svg";
import register from "../assets/register.svg";
import login from "../assets/login.svg";
import empty from "../assets/empty.svg";
import reDirect from "../assets/redirect.svg";

interface navLinksTypes {
  href: string;
  label: string;
}

interface heroDataTypes {
  text: string;
  ImageSrc: string;
}

export const navLinks: navLinksTypes[] = [
  {
    label: "Settings",
    href: "settings",
  },

  {
    label: "Subscriptions",
    href: "subscriptions",
  },

  {
    label: "Profile",
    href: "profile",
  },

  {
    label: "Bookings",
    href: "history",
  },
];

export const heroData: heroDataTypes[] = [
  {
    text: "The only place that “success” comes before “work” is in the dictionary",
    ImageSrc: Image1,
  },
  {
    text: "The only place that “success” comes before “work” is in the dictionary",
    ImageSrc: Image2,
  },
];

export const logoImg: any = logo;
export const debitImg: any = debit;
export const networkImg: any = network;
export const loginImg: any = login;
export const registerImg: any = register;
export const emptyImg: any = empty;
export const notFound: any = notfound;
export const redirectImg: any = reDirect;
