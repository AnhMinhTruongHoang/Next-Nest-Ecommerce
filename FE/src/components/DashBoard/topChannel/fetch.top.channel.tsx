import {
  GoogleOutlined,
  GithubOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { TwitterOutlined, VideoCameraOutlined } from "@ant-design/icons";

export async function getTopChannels() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      name: "Google",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: <GoogleOutlined style={{ fontSize: 24, color: "#4285F4" }} />,
    },
    {
      name: "X.com",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: <TwitterOutlined style={{ fontSize: 24, color: "#000" }} />,
    },
    {
      name: "Github",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: <GithubOutlined style={{ fontSize: 24 }} />,
    },
    {
      name: "Vimeo",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: <VideoCameraOutlined style={{ fontSize: 24, color: "#1ab7ea" }} />,
    },
    {
      name: "Facebook",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: <FacebookOutlined style={{ fontSize: 24, color: "#1877F2" }} />,
    },
  ];
}
