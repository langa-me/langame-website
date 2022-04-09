/* eslint-disable no-unused-vars */
import Pagination from "@mui/material/Pagination";
import { connectPagination } from "react-instantsearch-dom";



const P = ({ currentRefinement, nbPages, refine, createURL }: any) => (
    <Pagination count={nbPages}
        onChange={(e, value) => refine(value)}
    />
);

const CustomAlgoliaPagination = connectPagination(P);
export default CustomAlgoliaPagination;
