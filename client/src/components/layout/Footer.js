import React, { Component } from 'react';
class Footer extends Component {
    render() { 
        return (  
            <footer className="bg-dark text-white mt-4 p-4 text-center">
    Copyright &copy; {new Date().getFullYear()} ShinWatch
  </footer>
        );
    }
}
 
export default Footer;