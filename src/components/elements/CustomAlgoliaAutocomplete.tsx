import {
    Autocomplete, Divider, Grid, TextField, Tooltip,
  } from "@mui/material";
  import type {
    AutocompleteConnectorParams,
    AutocompleteWidgetDescription,
  } from "instantsearch.js/es/connectors/autocomplete/connectAutocomplete";
  import connectAutocomplete
    from "instantsearch.js/es/connectors/autocomplete/connectAutocomplete";
  import {useEffect, useState} from "react";
  import {Highlight, useConnector} from "react-instantsearch-hooks-web";
  import type {Hit} from "instantsearch.js/es";
  
  type UseAutocompleteProps = AutocompleteConnectorParams;
  
  const useAutocomplete = (props?: UseAutocompleteProps) => {
    return useConnector<AutocompleteConnectorParams,
    AutocompleteWidgetDescription>(
        connectAutocomplete,
        props
    );
  };
  interface CustomAutocompleteProps extends UseAutocompleteProps {
    onSelectedHit?: (hit: any) => void;
    onHitsChanged?: (hits: Hit[]) => void;
    // e.g. {"fooBar": "product is bad!!"}
    disabledHits?: {[id: string]: string};
  }
  const CustomAlgoliaAutocomplete = (props: CustomAutocompleteProps) => {
    const {indices, refine} = useAutocomplete(props);
    const [inputValue, setInputValue] = useState("");
    const [value, setValue] = useState<any>({});
  
    useEffect(() => {
      // when hits change, check if we can get a prompt out of the product
      if (
        indices.length > 0 &&
        props.onHitsChanged
      ) {
        // assuming indices 0 is products :)
        props.onHitsChanged(indices[0].hits);
      }
    }, [indices]);
  
    return (
      <Autocomplete
        options={indices.flatMap((e) => e.hits).map((e) => e)}
        getOptionLabel={(e: any) => e?.name || ""}
        value={value}
        onChange={(e, v) => {
          setValue(v);
        }}
        inputValue={inputValue}
        onInputChange={(e, v) => {
          refine(v);
          setInputValue(v);
        }}
        renderInput={(params) =>
          <TextField
            {...params}
            variant="outlined"
            label="Search"
            placeholder="Search"
          />
        }
        renderOption={({...renderProps}, option, state) =>
          // @ts-ignore
          <Tooltip
            {...renderProps}
            key={option.objectID}
            placement="right"
            title={
            props.disabledHits &&
              option.objectID in props.disabledHits ?
              props.disabledHits[option.objectID] : ""
            }>
            {/* @ts-ignore */}
            <Grid
              // @ts-ignore
              {...renderProps}
              container
              direction="column"
              spacing={2}
              sx={{
                "width": "100%",
                "margin": "0",
                // hover cursor
                "&:hover": props.disabledHits &&
              option.objectID in props.disabledHits ? undefined : {
                cursor: "pointer",
                backgroundColor: "rgba(0, 0, 0, 0.08)",
              },
                // click effect press
                "&:active": props.disabledHits &&
              option.objectID in props.disabledHits ? undefined : {
                backgroundColor: "rgba(0, 0, 0, 0.12)",
              },
                // color disabled like when it is disabled
                "backgroundColor": props.disabledHits &&
              option.objectID in props.disabledHits ?
              "rgba(0, 0, 0, 0.12)" : undefined,
              }}
              onClick={() => {
                setInputValue(option.name);
                setValue(option);
                if (props.onSelectedHit) props.onSelectedHit(option);
              }}
            >
              <Grid item xs={4}>
                <Highlight attribute="topic" hit={option} />
              </Grid>
              <Grid item xs={4}>
                <Divider />
              </Grid>
            </Grid>
          </Tooltip>
        }
      />
    );
  };
  
  export default CustomAlgoliaAutocomplete;
