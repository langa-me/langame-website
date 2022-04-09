import { ContentCopy, Delete, FileDownload } from "@mui/icons-material";
import { Divider, Fab, List, ListItem, ListItemText, Paper, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { collection } from "firebase/firestore";
import { useSnackbar } from "notistack";
import * as React from "react";
import { Configure, connectHits, InstantSearch } from "react-instantsearch-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import CustomAlgoliaPagination from "../../components/elements/CustomAlgoliaPagination";
import CustomAlgoliaSearchBox from "../../components/elements/CustomAlgoliaSearchBox";
import { algoliaPrefix, searchClient } from "../../utils/constants";


interface ConversationHit {
  channel: {
    id: string;
    name: string;
  };
  conversation: {
    author: string;
    bot: boolean;
    content: string;
    createdAt?: Date;
    editedAt?: Date;
  }[];
  createdAt: Date;
  guild: {
    id: string;
    name: string;
  };
  objectID: string;
  _highlightResult: any;
  __position: number;
}

const CHits = ({ hits }: {
  hits: Array<ConversationHit>
}) => {
  const hit = hits && hits.length > 0 && hits[0] ? hits[0] : undefined;
  // reverse the list
  const conversation = hit?.conversation?.reverse();
  const { enqueueSnackbar } = useSnackbar();
  
  const onCopy = () => {
    const text = `# ${hit?.channel?.name}\n
${hit?.conversation?.map((e) => e.author+"\n"+e.content).join("\n\n")}`;
    navigator.clipboard.writeText(text);
    enqueueSnackbar("Copied to clipboard");
  };
  return (
    <Paper
      sx={{
        width: "100%",
      }}
    >
      <Stack
        sx={{
          // position fabs bottom right
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
        }}
        spacing={2}
      >
        <Tooltip title="Copy conversation">
          <span>
          <Fab color="default" aria-label="copy"
            onClick={onCopy}
          >
            <ContentCopy />
          </Fab>
          </span>
        </Tooltip>
        <Tooltip title="Coming soon">
          <span>
          <Fab disabled color="default" aria-label="delete">
            <Delete />
          </Fab>
          </span>
        </Tooltip>
        <Tooltip title="Coming soon">
          <span>
          <Fab disabled color="default" aria-label="export">
            <FileDownload />
          </Fab>
          </span>
        </Tooltip>
      </Stack>
      <List>
        <ListItem>
          <ListItemText
            primary={hit?.channel?.name}
            primaryTypographyProps={{
              color: "primary",
              variant: "subtitle1",
            }}
          />
        </ListItem>
        {
          conversation?.map((e) =>
            <ListItem
              key={e.author}
            >
              <ListItemText
                secondary={e.content}
                primary={e.author}
                primaryTypographyProps={{
                  color: "primary",
                  variant: "body1",
                }}
                secondaryTypographyProps={{
                  color: "grey.200",
                  variant: "body2",
                }}
              />
            </ListItem>
          )
        }
      </List>
    </Paper>
  )
};
// @ts-ignore
const CustomHits = connectHits(CHits);

export default function SavedConversations() {
  const firestore = useFirestore();
  const conversationsCollection = collection(firestore, "saved_conversations");
  const { status, data: conversations } = useFirestoreCollectionData(conversationsCollection, {
    idField: "id",
  });
  const {data: user} = useUser();

  return (
      <Stack
        sx={{
          width: "70%",
        }}
        spacing={4}
        alignContent="center"
        alignItems="center"
      >
        <Typography
          variant="h3"
        >
          Conversations
        </Typography>
        <Divider />
        {
          status === "loading" ?
          <Skeleton
            variant="text"
            height={40}
            /> :
          conversations?.length === 0 &&
            <Typography
              variant="h6"
            >
              You will see saved conversations here once you have any 😇.
              Try /setup to request the Langame Discord bot save conversations.
            </Typography>
        }
        <InstantSearch searchClient={searchClient} indexName={
          algoliaPrefix + "saved_conversations"}>
          <CustomAlgoliaSearchBox />
          <Configure hitsPerPage={1}
            filters={`guild.id:${user?.uid}`}
          />
          <CustomHits />
          <CustomAlgoliaPagination />
        </InstantSearch>
      </Stack>
  );
}

