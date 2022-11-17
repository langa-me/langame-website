import { Login } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useNavigate } from "react-router-dom";
import Hero from "../components/sections/Hero";




const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <Hero className="illustration-section-01" />

        <Grid container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={4}

        >
          <Grid item
          >
            <Grid item
              sx={{
                textAlign: "center",
                margin: "1em",
              }}
            >
                  <Button
                    endIcon={<Login/>}
                    variant="outlined"
                    onClick={
                      () => navigate("/signin")
                    }
                  >
                    Play
                  </Button>
            </Grid>
          </Grid>
        </Grid>
    </>
  );
}



export default Home;
