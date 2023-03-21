import React from "react";
import AppContext from "./AppContext";

export default class State extends React.Component {
  constructor(props) {
    super(props);

    this.setUserData = (data) => this.setState({ userData: data });

    this.unsetUserData = () => this.setState({ userData: null });

    this.setCartQuantity = (data) => this.setState({ cartQuantity: data });

    this.unsetCartQuantity = () => this.setState({ cartQuantity: [] });

    this.setWishListQuantity = (data) => this.setState({ wishListQuantity: data });
    
    this.setOldGameData = (data) => this.setState({ oldGameData: data });

    this.setTokenData = (data) => this.setState({ tokenData: data });

    this.unsetWishListQuantity = () => this.setState({ wishListQuantity: [] });

    this.unsetTokenData = () => this.setState({ tokenData: [] });

    this.setTotalUnreadChatQuantity = (data) => this.setState({ totalUnreadChatQuantity: data });

    this.setFilterDetails = (data) => this.setState({ filterDetails: data });

		this.unsetFilterDetails = () => this.setState({ filterDetails: null });

    this.setFileSetting = (data) => this.setState({ fileSetting: data });

    this.setPaymentTerm = (data) => this.setState({ paymentTerm: data });

    this.state = {
      userData: props.persistantData,
      setUserData: this.setUserData,
      unsetUserData: this.unsetUserData,
      // quantity:props.persistantData,
      unsetCartQuantity: this.unsetCartQuantity,
      setCartQuantity: this.setCartQuantity,
      cartQuantity: [],
      unsetWishListQuantity: this.unsetWishListQuantity,
      setWishListQuantity: this.setWishListQuantity,
      wishListQuantity: [],
      setOldGameData: this.setOldGameData,
      oldGameData: [],
      setTokenData: this.setTokenData,
      tokenData: [],
      unsetTokenData: this.unsetTokenData,
      totalUnreadChatQuantity: props.UnreadChatQuantity,
      setTotalUnreadChatQuantity: this.setTotalUnreadChatQuantity,
      setFilterDetails: this.setFilterDetails,
			unsetFilterDetails: this.unsetFilterDetails,
      fileSetting:[],
	    setFileSetting: this.setFileSetting,
      paymentTerm:[],
	    setPaymentTerm: this.setPaymentTerm,
    };
  }

  render = () => {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  };
}