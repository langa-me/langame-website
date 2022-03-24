import { LoadingButton } from "@mui/lab";
import { Button, Card, CardActions, CardContent, Divider, FormGroup, Skeleton, Stack, Typography } from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { collection, doc, query, setDoc, where } from "firebase/firestore";
import { useSnackbar } from "notistack";
import React from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";

const Billing = () => {
  const stripe = useStripe();
  const elements = useElements();
  const fs = useFirestore();
  const user = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const organizationsCollection = collection(fs, "organizations");
  const organizationsQuery = query(organizationsCollection,
      where("members", "array-contains", user.data?.uid));
  const { status, data: organizations } = useFirestoreCollectionData(organizationsQuery, {
      idField: "id",
  });
  const [update, setUpdate] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
    const onAddPaymentMethod = async (e: any) => {
      if (!stripe || !elements) return;
      setIsLoading(true);
      e.preventDefault();
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement)!,
      });
      if (error) {
        console.log("error", error);
        enqueueSnackbar(error.message, { variant: "error" });
      setIsLoading(false);
  return;

      } else {
        console.log("paymentMethod", paymentMethod);
        // add payment method to org
        setDoc(doc(organizationsCollection, organizations[0].id), {
          paymentMethods: {
            [paymentMethod!.id]: {
              ...paymentMethod,
            },
          },
        }, { merge: true })
        .then(() => {
        enqueueSnackbar("Added payment method", { variant: "success" });
        })
        .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
        })
        .finally(() => {
        setIsLoading(false);
        setUpdate(!update);
        });
      }
    };

  return (
      <Stack
        // direction="column"
        // alignContent="center"
        // alignItems="center"
        // justifyContent="center"
        sx={{
          width: "70%",
      }}
      spacing={4}
      >
        <Typography
          variant="h3"
          >
          Billing
          </Typography>
          <Divider />
          {
            
            status === "loading" ?
            <Skeleton variant="rectangular" width="100%" height={200} /> :
            !update &&
            organizations[0].paymentMethods ?
            <Card
              sx={{
                  width: "100%",
                  padding: 4,
              }}
            >
                        
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Payment methods
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {
          Object.values<any>(organizations[0].paymentMethods)[0]?.card?.brand
        }
        </Typography>
        
        <Stack
          direction="row"
          spacing={4}
        >
      <Typography variant="body2" color="text.secondary"> 
        {
          "****"+Object.values<any>(organizations[0].paymentMethods)[0]?.card?.last4
        }
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {
          Object.values<any>(organizations[0].paymentMethods)[0]?.card?.exp_month +
          "/" +
          Object.values<any>(organizations[0].paymentMethods)[0]?.card?.exp_year
        }
        </Typography>
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small"
          onClick={() => setUpdate(true)}
        >Update</Button>
      </CardActions>

              </Card> :

            <FormGroup
              sx={{
                width: "50%",
                height: "400px",
                backgroundColor: "grey.900",
                padding: "20px",
                // corner
                borderRadius: "10px",
              }}
            >
              
                <Stack
                  // maximum space between elements
                  spacing={4}
                  direction="column"
                  // alignContent="center"
                  // alignItems="center"
                  // justifyContent="center"
                >
                <CardElement
                  options={{
                    iconStyle: "solid",
                    style: {
                      base: {
                        iconColor: "#ACADFF",
                        color: "#ACADFF",
                        fontWeight: 500,
                        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                        fontSize: "16px",
                        fontSmoothing: "antialiased",
                        ":-webkit-autofill": {
                          color: "#fce883"
                        },
                        "::placeholder": {
                          color: "#87bbfd"
                        }
                      },
                      invalid: {
                        iconColor: "#ffc7ee",
                        color: "#ffc7ee"
                      }
                    }
                    
                  }}
                />
                <LoadingButton
                  onClick={onAddPaymentMethod}
                  loading={isLoading}
                >
                  Submit
                </LoadingButton>
                {
                  update &&
                <Button
                  onClick={() => setUpdate(false)}
                >
                  Cancel
                </Button>
}
                </Stack>
            </FormGroup>
}
            </Stack>
  );
};
export default Billing;
