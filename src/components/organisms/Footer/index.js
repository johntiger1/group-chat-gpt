import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";

export default function Footer() {
  const FooterBar = styled(Box)({
    position: "fixed",
    left: 0,
    bottom: 5,
    width: "100%",
    textAlign: "center",
    padding: "5px",
    color: "#d8e3e7",
    "& a": {
      textDecoration: "none",
    },
  });

  return (
    <FooterBar>
      <Typography variant="h6">
        Truly developed with{" "}
        <span role="img" aria-label="love">
          ♥️
        </span>{" "}
        by <Link href="https://samx23.github.io">Sami Kalammallah</Link> ©{" "}
        {new Date().getFullYear()}
      </Typography>
    </FooterBar>
  );
}