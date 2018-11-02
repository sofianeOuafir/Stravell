import React from "react";
import { MegadraftEditor } from "megadraft";
import actions from "megadraft/lib/actions/default";
import { FaFont, FaUnderline } from 'react-icons/fa';

const FaFontIcon = (props) => (
  <FaFont size="18" />
);

const FaUnderlineIcon = (props) => (
  <FaUnderline size="18" />
);

const styleMap = {
  HEADER_ONE: {
    fontSize: 30
  }
};

const customActions = actions.concat([
  { type: "inline", label: "U", style: "UNDERLINE", icon: FaUnderlineIcon },
  { type: "inline", label: "H1", style: "HEADER_ONE", icon: FaFontIcon }
]);
class MyEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MegadraftEditor
          customStyleMap={styleMap}
          actions={customActions}
          {...this.props}
        />
      </div>
    );
  }
}



export default MyEditor;
