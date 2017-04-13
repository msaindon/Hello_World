import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import SearchBox from './SearchBox'


const SERVER_DATA =
[
  {category: "Sporting Goods", price: 49.99, stocked: true, name: "Football"},
  {category: "Sporting Goods", price: 9.99, stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: 29.99, stocked: false, name: "Basketball"},
  {category: "Electronics", price: 99.99, stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: 399.99, stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: 199.99, stocked: true, name: "Nexus 7"}
];


class App extends Component {
    constructor (props) {
        super(props)
        this.state = {
            searchTerm: '',
            inStock: false,
            isBuying: {},
            total: 0
        }
    }

    onFilterTextInput (e) {
        this.setState({searchTerm: e.target.value})
    }

    onFilterCheckBoxInput (e) {
        this.setState({inStock: e.target.checked})
    }

    onIsBuying(key, value, price) {
        let newTotal
        if (value) {
            newTotal = this.state.total + price
        } else {
            newTotal = this.state.total - price
        }
        let newBuyObject = Object.assign(this.state.isBuying, {[key]: value})
        this.setState({isBuying: newBuyObject})
    }

  render() {
    return (
        <div>
            <SearchBox
                searchTerm={this.state.searchTerm}
                inStock={this.state.inStock}
                onFilterTextInput={this.onFilterTextInput.bind(this)}
                onFilterCheckBoxInput={this.onFilterCheckBoxInput.bind(this)}
            />
            <GenerateTable
                productData={SERVER_DATA}
                searchTerm={this.state.searchTerm}
                inStock={this.state.inStock}
                isBuying={this.state.isBuying}
                onIsBuying={this.onIsBuying.bind(this)}
            />
        </div>
    )
  }
}


class GenerateTable extends Component {
    static propTypes = {
        productData: React.PropTypes.array,
        searchTerm: React.PropTypes.string,
        inStock: React.PropTypes.bool,
        isBuying: React.PropTypes.object,
        onIsBuying: React.PropTypes.func
    }

    render() {
        let tableRow = []
        let categories = []
        this.props.productData.forEach((productItem) => {
            const newItem = categories.indexOf(productItem.category) === -1
            if (newItem) {
                categories.push(productItem.category)
            }
        })

        categories.forEach((currentCategory) => {
            tableRow.push(
                <tr key={currentCategory}>
                    <td colSpan='2'><strong>{currentCategory}</strong></td>
                </tr>
            )
            this.props.productData.forEach((productItem) => {
                let key = `${currentCategory}${productItem.name}`
                tableRow.push(
                    <ProductRow
                        key={key}
                        {...productItem}
                        currentCategory={currentCategory}
                        searchTerm={this.props.searchTerm}
                        inStock={this.props.inStock}
                        isBuying={this.props.isBuying}
                        onIsBuying={this.props.onIsBuying}
                    />
                )
            })
        })

        return (
            <div>
                <table>

                    <thead>
                        <th><td>Name</td></th><th><td>Price</td></th>
                    </thead>

                    <tbody>
                        {tableRow}
                    </tbody>

                </table>
            </div>
        )
    }
}

class ProductRow extends Component {
    static propTypes = {
        name: React.PropTypes.string,
        category: React.PropTypes.string,
        stocked: React.PropTypes.bool,
        price: React.PropTypes.number,
        currentCategory: React.PropTypes.string,
        searchTerm: React.PropTypes.string,
        inStock: React.PropTypes.bool,
        isBuying: React.PropTypes.object,
        onIsBuying: React.PropTypes.func
    }

    handleOnIsBuying (e) {
        const value = e.target.checked
        let key = '${this.props.currentCategory)${this.props.name}'
        this.props.onIsBuying(key, value, this.props.price)
    }

    render () {
        const filterMatch = this.props.name.indexOf(this.props.searchTerm) !== -1
        let style = {color: 'black'}
        if (this.props.currentCategory === this.props.category) {
            if (!this.props.stocked) {
                style.color = 'red'
            }
            let key = `${this.props.category}${this.props.name}`
            let amIChecked = this.props.isBuying[key] || false
            if (!this.props.inStock || this.props.stocked) {
                if (filterMatch) {
                    return(
                      <tr key={key}>
                        <td style={style}>
                          <input
                            checked={amIChecked} type="checkbox"
                            onChange={this.handleOnIsBuying.bind(this)}
                          />{this.props.name}
                        </td>
                        <td>{this.props.price}</td>
                      </tr>
                    )
                }
            }
        }
        return null
    }
}


export default App;
