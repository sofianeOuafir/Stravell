import React from "react";

class DropDownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      title: props.title || 'Show menu',
      titleClassName: props.titleClassName || 'dropdown-menu__title',
      contentClassName: props.contentClassName || 'dropdown-menu__content'
    };
  }

  showMenu = e => {
    e.preventDefault();
    this.setState(() => ({ showMenu: true }), () => {
      document.addEventListener('click', this.closeMenu);
    });
  };

  componentWillUnmount () {
    document.removeEventListener('click', this.closeMenu);
  }

  closeMenu = () => {
    this.setState(() => ({ showMenu: false }), () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }

  render() {
    return (
      <div className="dropdown-menu">
        <button className={this.state.titleClassName} onClick={this.showMenu}>{ this.state.title }</button>
        {this.state.showMenu && (
          <div className={this.state.contentClassName}>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default DropDownMenu;
