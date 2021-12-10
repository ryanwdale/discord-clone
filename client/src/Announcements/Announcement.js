import { Header, Icon } from "semantic-ui-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

const Announcement = (props) => {


  return (
    <div className="AnnouncementContainer">
      <div className="AnnouncementHeader">
        <Header as="h4">
          {props.displayName}
          <span className="AnnouncementTimeStamp">
            {format(new Date(props.timestamp), "MM/dd/yyyy H:mm")}
          </span>
        </Header>
      </div>
      <ReactMarkdown children={props.announcement} />
    </div>
  );
};

export default Announcement;
