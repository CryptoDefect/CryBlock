import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Input,
  Card,
  Divider,
  message,
  Flex,
  Image,
  Popover,
  ConfigProvider,
} from "antd";
import "./App.css";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { isAddress } from "ethers";
import { SearchOutlined, ShoppingOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const API_KEY = "JVURDYBNJ25MHIFA6PQ2DFXKXIA2N9E4QK";
const headerOption = [
  {
    name: "平台简介",
    key: 1,
    position: "#1",
  },
  {
    name: "安全案例",
    key: 2,
    position: "#2",
  },
  {
    name: "在线分析",
    key: 3,
    position: "#3",
  },
];

const App = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [monaco,setMonaco] = useState(null)
  const [selectedBox, setSelectedBox] = useState(null);

  const [filePath] = useState(""); 
  const [code, setCode] = useState(`
    pragma solidity ^0.8.0;

    contract MyContract {
        string public name = "CryBlock";

        function setName(string memory newName) public {
            name = newName;
        }
    }
  `);
  const [caseList, setCaseList] = useState([
    {
      address: "0xA62142888ABa8370742bE823c1782D17A0389Da1",
      title: "Fomo3D应用漏洞案例",
      describe:
        "Fomo3D是一个去中心化游戏应用，其游戏结算机制以链上生成的伪随机数为核心。2018年7月，Fomo3D由于其伪随机数实现逻辑中的漏洞遭到黑客攻击。攻击者利用Fomo3D合约中弱随机数缺陷，通过操纵弱随机数结果，连续赢得空投奖励和最终奖品。这些攻击使普通参与者难以获胜，导致游戏资金和参与度急剧下降，造成了超过两百万美元的经济损失。",
      img: require("./pic/FOMO3D.jpg"),
    },
    {
      address: "0xDD5A649fC076886Dfd4b9Ad6aCFC9B5eb882e83c",
      title: "NBAxNFT应用漏洞案例",
      describe:
        "NBAxNFT是NBA官方推出的去中心化应用。在2022年4月，其计划向早期支持NBAxNFT这一项目的用户空投NFT奖励，并通过数字签名应用以保证只有获得许可的特定用户群体可以铸造NFT。然而，其数字签名应用中的实现漏洞使得数字签名可以被重放，并允许铸造权限被授予授到了不在原始允许名单上的其他钱包，造成了10000+NFT数字资产的预期之外的发放，并导致空投临时停止。",
      img: require("./pic/NBA-NFT.jpg"),
    },
    {
      address: "0x8d993aaf8e92c2027a5358b9914392050b03356d",
      title: "ZKP应用漏洞案例",
      describe:
        "零知识证明为代表的密码技术已经在区块链上取得了广泛应用。然而，在零知识证明验证的过程中所涉及到的EcMul密码学操作的可延展性可以导致潜在的证明重放风险，并在下游应用中导致双花（Double Spending）等安全问题。该漏洞曾影响了多个以太坊上广泛应用的代码库，如 snarkjs、ethsnarks 和 ZoKrates，以及去中心化应用程序 hopper、Heiswap 和 Miximus等。",
      img: require("./pic/ZKP.jpeg"),
    },
  ]);

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "solidity" });
      monaco.languages.setMonarchTokensProvider("solidity", {
        tokenizer: {
          root: [
            // 关键字: 基本语言结构
            [/pragma solidity/, "keyword"],
            [/contract|library|interface/, "keyword"],
            [/function|modifier|constructor/, "keyword"],
            [/if|else|for|while|return|emit/, "keyword"],
            [/public|private|internal|external/, "keyword"],
            [/pure|view|payable|nonpayable/, "keyword"],
            [/require|revert|assert/, "keyword"],

            // 数据类型: 基础和复杂数据类型
            [
              /bool|address|uint256|uint8|uint|int|int256|bytes|bytes32|string|mapping/,
              "type",
            ],
            // Solidity 内置常量和全局变量
            [/\bblock|msg|tx|now\b/, "builtin"],

            // 访问权限修饰符
            [/\bview|pure|payable|nonpayable|memory|storage\b/, "keyword"],

            // 事件声明
            [/event\b/, "keyword"],

            // 运算符和符号
            [/[{}()[\]]/, "@brackets"],
            [/[=><!~?:&|+*/^%]+/, "operator"],

            // 数字
            [/\b\d+\b/, "number"],

            // 字符串
            [/".*?"/, "string"],
            [/'[^']*'/, "string"],

            // 注释
            [/\/\/.*/, "comment"],
            [/\*/, "comment", "@comment"],

            // 标识符
            [
              /[a-zA-Z_$][\w$]*/,
              {
                cases: {
                  "@keywords": "keyword",
                  "@default": "identifier",
                },
              },
            ],
          ],
          comment: [
            [/[^/*]+/, "comment"],
            [/^\*\/+/, "comment", "@pop"],
            [/[/*]/, "comment"],
          ],
        },
        // 定义颜色和其他样式
        keywords: [
          "pragma",
          "solidity",
          "contract",
          "library",
          "interface",
          "function",
          "modifier",
          "constructor",
          "if",
          "else",
          "for",
          "while",
          "return",
          "emit",
          "public",
          "private",
          "internal",
          "external",
          "pure",
          "view",
          "payable",
          "nonpayable",
          "require",
          "revert",
          "assert",
          "event",
          "bool",
          "address",
          "uint256",
          "uint8",
          "uint",
          "int",
          "int256",
          "bytes",
          "bytes32",
          "string",
          "mapping",
          "block",
          "msg",
          "tx",
          "now",
          "view",
          "pure",
          "payable",
          "nonpayable",
          "memory",
          "storage",
        ],
        operators: [
          "=",
          ">",
          "<",
          "!",
          "~",
          "?",
          ":",
          "==",
          "<=",
          ">=",
          "!=",
          "&&",
          "||",
          "++",
          "--",
          "+",
          "-",
          "*",
          "/",
          "&",
          "|",
          "^",
          "%",
          "<<",
          ">>",
          ">>>",
          "+=",
          "-=",
          "*=",
          "/=",
          "&=",
          "|=",
          "^=",
          "%=",
          "<<=",
          ">>=",
          ">>>=",
        ],
      });
      monaco.editor.defineTheme("solidityTheme", {
        base: "vs-dark", 
        inherit: true,
        rules: [
          { token: "comment", foreground: "008000" }, // 注释设为绿色 (#008000)
          { token: "keyword", foreground: "569CD6" }, // 关键字
          { token: "type", foreground: "4EC9B0" }, // 类型
          { token: "string", foreground: "D69D85" }, // 字符串
          { token: "number", foreground: "B5CEA8" }, // 数字
        ],
        colors: {
          "editor.foreground": "#FFFFFF", // 设置编辑器前景色
          "editor.background": "#1E1E1E", // 设置编辑器背景色
          "editorCursor.foreground": "#A7A7A7", // 光标颜色
          "editor.lineHighlightBackground": "#333333", // 当前行高亮背景
          "editorLineNumber.foreground": "#858585", // 行号颜色
          "editor.selectionBackground": "#264F78", // 选区背景色
          "editor.inactiveSelectionBackground": "#3A3D41", // 非活动选区背景色
        },
      });
      
      monaco.editor.setTheme("solidityTheme");
      
    }
  }, [monaco]);

  const getHttp = async (id) => {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${id}&apikey=${API_KEY}`
      );
      const sourceCode = response.data.result[0].SourceCode;
      if (sourceCode) {
        setCode(sourceCode);
      } else {
        message.error("未找到智能合约代码");
      }
    } catch (error) {
      message.error("获取智能合约代码失败");
    }
  };
  const handleSearch = async () => {
    if (!isAddress(contractAddress)) {
      message.error("请输入有效的以太坊地址");
      return;
    }
    getHttp(contractAddress);
  };

  const handleBtn = () => {
    console.log("提交按钮被点击");
    console.log("文件路径:", filePath);
  };

  const caseClick = (index) => {
    setSelectedBox(index);
    const res = caseList.map((item, i) => {
      return {
        ...item,
        border: index === i ? true : false,
      };
    });
    setCaseList(res);
    setContractAddress(caseList[index].address);
    if (index === 1) 
      setCode(`pragma solidity ^0.8.7;
// SPDX-Licence-Identifier: GPL-3.0-or-later

/*

kkkkkkkOK0kkOXN0kkOXKkkkkkk0WMMM0kXMMMW0kkkkOXMMMNOdoodkXMWWKxoood0WMMMNOkkkk0NMMMW0doookXMWKkkkKMMN0kkkkONXkkkkkkkOK0kkOXMW0xoooxKWMXkkkOXMKkkONXkxkk
........l:...x0;..,Oo......:XMWX:,0MWMK;.....xMM0:.    .,ONx'.    .lXNd,......;kWXl.    .,kNl...oWM0,....'ko........c:...kXl.    .'xNd....dWo..'OKdl;.
;.   .':o,  .x0'  .kl   .,,oN0c'.'kNMMk.     cWNc   ',   :x'  .:.  .xd.  .,'.  '0d   ';.  ,0l   lWMd.     lx;.    ':o,  .xd.  .:.  'Oo    ;Xo  .kW0ocd
Wx.  '0WK,  .x0'  .kl   cNWWK;   .,kMWo   .  ,KX;   dO;..cl.  ;Kd..'dc   lKk;  .xc   oK,  .kl   lWWc  ..  :XMx.  ,0WK,  .xl   lX;  .xo    .xo  .kk..lx
Mk.  '0MK;   ok.  .kl   :KKXO'  .dllNX;  ',  .kX;   c00KXNx.  .x0KXNXc   oXO;  .dc   oNOxxkKc   lWK,  ,,  '0Mk.  ,KMK,  .xl   lX:  .dl     cc  .kO:;;;
Mk.  '0MK,   ..   .kl    ..l0:   ,;.oO'  :l   dWo    ..,lK0,    .':kXc   oXO;  .d:   oMMMMMWc   lWO.  cc  .xMk.  ,KMK,  .xl   lX:  .dl   . .,  .kKo;,,
Mk.  '0MK,   ..   .kl   .''lX0,  .;:xd.  ox.  cNNxc,'.   :X0o;,.   .xc   oXO;  .d:   oMMMMMNc   lWd   dd   lWk.  ,KMK,  .xl   lX:  .dl  .;.    .kMWdc:
Mk.  '0MK,  .oO'  .kl   cXNWWMXo. lNWl   .'   ,0NXXXXd.  'ONXXXK;   c:   lXO;  .dc   oNkooxKc   lNc   ..   ;Xk.  ,KMK,  .xl   lX:  .dl  .o,    .kMWOxo
Mk.  '0MK,  .x0'  .kl   cXNWMMMWKl;kX;        .xo..'kk.  ,o;..lKc   lc   oKk;  .xc   o0,  .kl   l0,        .Ok.  ,KMK,  .xl   lK;  .xo  .kl    .OWNNXc
Mk.  '0MK;  .x0'  .kl   ..'lNMMMMWdxO.  .dk,   ol   .'   :k'  .,.  .xo   ':,.  'Od   .,.  ,0l   lk.  'xx'   dk.  ,KMK,  .xx.  .,.  'Oo  .kO.   .kKdol.
MO,..:KMXc..'kK:..;Od......cXMMMMM0kx,..cXWo...o0o'.....:0Wk;.....'dNKc.      'xNXo'.....;ONo...od'..lNNl...dO,..cXMXc..,kNd'.....,kWd..,ONl...;0WWWNl
MNK00KWMWX00KNWK00KWN000000XWMMMMMWWNKK0XWMN000XWWXOxkkKWMMMN0kxkOXWMMN0dllooxKWWMMXOkkk0NMWX000XX000XMMX000XNK00XWMWX00KNMMXOkkk0NMMNK0KNWX000KNMMMWX

*/

/// @author: galaxis.xyz - The platform for decentralized communities.

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";

import "./ssp/community_interface.sol";
import "./ssp/sale_configuration.sol";
import "./ssp/recovery.sol";
import "./ssp/IRNG.sol";
import "./ssp/dusty.sol";
import "./ssp/card_with_card.sol";
import "./ssp/token_interface.sol";

struct sale_data {
    uint256 maxTokens;
    uint256 mintPosition;
    address[] wallets;
    uint16[] shares;
    uint256 fullPrice;
    uint256 discountPrice;
    uint256 presaleStart;
    uint256 presaleEnd;
    uint256 saleStart;
    uint256 saleEnd;
    uint256 dustPrice;
    bool areTokensLocked;
    uint256 maxFreeEC;
    uint256 totalFreeEC;
    uint256 maxDiscount;
    uint256 totalDiscount;
    uint256 freePerAddress;
    uint256 discountedPerAddress;
    string tokenPreRevealURI;
    address signer;
    bool presaleIsActive;
    bool saleIsActive;
    bool dustMintingActive;
    uint256 freeClaimedByThisUser;
    uint256 discountedClaimedByThisUser;
    address etherCards;
    address DUST;
    address ecVault;
    uint256 maxPerSaleMint;
    uint256 MaxUserMintable;
    uint256 userMinted;
    bool randomReceived;
    bool secondReceived;
    uint256 randomCL;
    uint256 randomCL2;
    uint256 ts1;
    uint256 ts;
}

struct sale_params {
    uint256 projectID;
    token_interface token;
    IERC721 ec;
    address dust;
    uint256 maxTokens;
    uint256 maxDiscount; //<--- max sold in presale across presale dust / eth
    uint256 maxPerSaleMint;
    uint256 clientMintLimit;
    uint256 ecMintLimit;
    uint256 discountedPerAddress; //<-- should apply to all presale
    uint256 freeForEC; //<-- for EC card holders
    uint256 discountPrice; //<-- for EC card holders - if zero not available should have *** dust ***
    uint256 discountDustPrice; //<-- for EC card holders - if zero not available should have *** dust ***
    uint256 fullPrice;
    address signer;
    uint256 saleStart;
    uint256 saleEnd;
    uint256 presaleStart;
    uint256 presaleEnd;
    uint256 fullDustPrice;
    address[] wallets;
    uint16[] shares;
}

// check approval limit - start / end of presale

contract The_Association_Sales is
    sale_configuration,
    Ownable,
    recovery,
    ReentrancyGuard,
    dusty,
    card_with_card
{
    using SafeMath for uint256;
    using Strings for uint256;

    uint256 public immutable projectID;
    token_interface public _token;

    uint256 immutable _MaxUserMintable;
    uint256 _userMinted;

    uint256 _ts1;
    uint256 _ts2;

    address private immutable _DUST;
    IERC721 private immutable _EC;

    uint16 public batchNumber;

    mapping(address => uint256) _freeClaimedPerWallet;
    mapping(address => uint256) _discountedClaimedPerWallet;

    event RandomProcessed(
        uint256 stage,
        uint256 randUsed_,
        uint256 _start,
        uint256 _stop,
        uint256 _supply
    );
    event batchWhitelistMint(uint16 indexed batchNumber, address receiver);
    event ETHPresale(address from, uint256 number_of_items, uint256 price);
    event ETHSale(address buyer, uint256 number_to_buy, uint256 ethAmount);
    event Allowed(address, bool);

    modifier onlyAllowed() {
        require(
            _token.permitted(msg.sender) || (msg.sender == owner()),
            "Unauthorised"
        );
        _;
    }

    // the constructor takes the bare minimum to conduct a presale and sale.

    constructor(sale_params memory sp)
        dusty(
            sp.dust,
            sp.signer,
            sp.fullDustPrice,
            sp.discountDustPrice,
            sp.maxPerSaleMint,
            sp.wallets,
            sp.shares
        )
        card_with_card(sp.signer)
    {
        projectID = sp.projectID;
        _EC = sp.ec;
        _token = sp.token;
        _DUST = sp.dust;
        _MaxUserMintable = sp.maxTokens - (sp.clientMintLimit + sp.ecMintLimit);

        _maxSupply = sp.maxTokens;
        _maxDiscount = sp.maxDiscount;

        _discountedPerAddress = sp.discountedPerAddress;
        _discountPrice = sp.discountPrice;
        _fullPrice = sp.fullPrice;

        _saleStart = sp.saleStart;
        _saleEnd = sp.saleEnd;

        _presaleStart = sp.presaleStart;
        _presaleEnd = sp.presaleEnd;

        _maxFreeEC = sp.freeForEC;
    }

    function _split(uint256 amount) internal {
        //  console.log("num wallets",wallets.length);
        bool sent;
        uint256 _total;
        for (uint256 j = 0; j < wallets.length; j++) {
            uint256 _amount = (amount * shares[j]) / 1000;
            if (j == wallets.length - 1) {
                _amount = amount - _total;
            } else {
                _total += _amount;
            }
            (sent, ) = wallets[j].call{value: _amount}(""); // don't use send or xfer (gas)
            require(sent, "Failed to send Ether");
        }
    }

    function setup(uint16 _batchNumber) external onlyAllowed {
        batchNumber = _batchNumber;
    }

    function checkDiscountAvailable(address buyer)
        public
        view
        returns (
            bool[3] memory,
            bool,
            uint256,
            uint256,
            uint256
        )
    {
        bool _final = false;

        return (
            [false, false, true],
            _final, // _final,
            _discountedClaimedPerWallet[buyer], // EC
            presold[buyer], // Not in use.
            _token.availableToMint()
        );
    }

    function mint_approved(
        vData memory info,
        uint256 number_of_items_requested,
        uint16 _batchNumber
    ) external {
        require(batchNumber == _batchNumber, "!batch");
        address from = msg.sender;
        require(verify(info), "Unauthorised access secret");
        _discountedClaimedPerWallet[msg.sender] += 1;
        require(
            _discountedClaimedPerWallet[msg.sender] <= 1,
            "Number exceeds max discounted per address"
        );
        presold[from] = 1;
        _mintCards(number_of_items_requested, from);
        emit batchWhitelistMint(_batchNumber, msg.sender);
    }

    // make sure this respects ec_limit and client_limit
    function mint(uint256 numberOfCards) external {
        _discountedClaimedPerWallet[msg.sender] += numberOfCards;
        require(
            _discountedClaimedPerWallet[msg.sender] <= maxPerSaleMint,
            "Number exceeds max discounted per address"
        );
        require(checkSaleIsActive(), "sale is not open");
        require(
            numberOfCards <= maxPerSaleMint,
            "Exceeds max per Transaction Mint"
        );
        _mintPayable(numberOfCards, msg.sender, _fullPrice);
    }

    function _mintPayable(
        uint256 numberOfCards,
        address recipient,
        uint256 price
    ) internal override {
        _mintCards(numberOfCards, recipient);
    }

    function _mintCards(uint256 numberOfCards, address recipient)
        internal
        override(dusty, card_with_card)
    {
        _userMinted += numberOfCards;
        require(
            _userMinted <= _MaxUserMintable,
            "This exceeds maximum number of user mintable cards"
        );
        _token.mintCards(numberOfCards, recipient);
    }

    function _mintDiscountCards(uint256 numberOfCards, address recipient)
        internal
        override(dusty, card_with_card)
    {
        _totalDiscount += numberOfCards;
        require(
            _maxDiscount >= _totalDiscount,
            "Too many discount tokens claimed"
        );
        _mintCards(numberOfCards, recipient);
    }

    function _mintDiscountPayable(
        uint256 numberOfCards,
        address recipient,
        uint256 price
    ) internal override(card_with_card) {
        require(msg.value == numberOfCards.mul(price), "wrong amount sent");
        _mintDiscountCards(numberOfCards, recipient);
        // _split(msg.value);
    }

    function setSaleDates(uint256 _start, uint256 _end) external onlyAllowed {
        _saleStart = _start;
        _saleEnd = _end;
    }

    function setPresaleDates(uint256 _start, uint256 _end)
        external
        onlyAllowed
    {
        _presaleStart = _start;
        _presaleEnd = _end;
    }

    function setMaxPerSaleMint(uint256 _maxPerSaleMint) external onlyOwner {
        maxPerSaleMint = _maxPerSaleMint;
    }

    function checkSaleIsActive() public view override returns (bool) {
        if ((_saleStart <= block.timestamp) && (_saleEnd >= block.timestamp))
            return true;
        return false;
    }

    function checkPresaleIsActive() public view override returns (bool) {
        if (
            (_presaleStart <= block.timestamp) &&
            (_presaleEnd >= block.timestamp)
        ) return true;
        return false;
    }

    function setWallets(
        address payable[] memory _wallets,
        uint16[] memory _shares
    ) public onlyOwner {
        require(_wallets.length == _shares.length, "!l");
        wallets = _wallets;
        shares = _shares;
    }

    receive() external payable {
        _split(msg.value);
    }

    function tellEverything(address addr)
        external
        view
        returns (sale_data memory)
    {
        // if community module active - get the community.taken[msg.sender]

        token_interface.TKS memory tokenData = _token.tellEverything();
        return
            sale_data(
                _maxSupply,
                tokenData._mintPosition,
                wallets,
                shares,
                _fullPrice,
                _discountPrice,
                _presaleStart,
                _presaleEnd,
                _saleStart,
                _saleEnd,
                _dustPrice,
                tokenData._lockTillSaleEnd,
                _maxFreeEC,
                _totalFreeEC,
                _maxDiscount,
                _totalDiscount,
                _freePerAddress,
                _discountedPerAddress,
                _token.tokenPreRevealURI(),
                _signer,
                checkPresaleIsActive(),
                checkSaleIsActive(),
                checkSaleIsActive() &&
                    (fullDustPrice > 0 || discountDustPrice > 0),
                _freeClaimedPerWallet[addr],
                _discountedClaimedPerWallet[addr],
                address(_EC),
                _DUST,
                _ecVault,
                maxPerSaleMint,
                _MaxUserMintable,
                _userMinted,
                tokenData._randomReceived,
                tokenData._secondReceived,
                tokenData._randomCL,
                tokenData._randomCL2,
                tokenData._ts1,
                tokenData._ts2
            );
    }
}`);
    else 
      getHttp(caseList[index].address);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 检查点击是否发生在 .custom-box 外部
      if (!event.target.closest(".custom-box")) {
        setSelectedBox(null); // 移除选中
        setCaseList(caseList.map(item => ({ ...item, border: false }))); // 重置边框
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [caseList]);

  return (
    <div className="container">
      <div
        style={{
          width: "100vw",
          background: "black",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <Flex className="header" align="center" justify="space-between">
          <span style={{ fontSize: 32, color: "#fff", marginLeft: "45px", }}>
            Cry<span style={{ color: "#B22222" }}>Block</span>
          </span>
          <Flex justify="space-around">
            {headerOption.map((i,index) => (
              <a className="header-center-item" href={i.position} key={index}>
                {i.name}
              </a>
            ))}
          </Flex>
          <Flex gap={135} style={{ visibility: 'hidden' }}>
            <SearchOutlined style={{ fontSize: 25, color: "#fff" }} />
            <ShoppingOutlined style={{ fontSize: 25, color: "#fff" }} />
          </Flex>
        </Flex>
      </div>


      <div className="content-1" id="1">
        <div>
          <span style={{ color: "white" }}>Cry</span>
          <span style={{ color: "#B22222" }}>Block</span>:
          <span style={{ fontFamily: "SimSun, serif",  fontWeight: "bold"}}> 区块链密码应用安全分析平台</span>
        </div>
      </div>




      <div className="content-2">
        <div style={{ fontFamily: "SimSun, serif" }}>
          CryBlock是首个针对区块链密码应用的安全分析平台。支持针对数字签名、默克尔证明、链上随机数、
        </div>
        <div style={{ fontFamily: "SimSun, serif" }}>
          零知识证明、消息摘要等各类链上密码创新应用开展安全分析，有效保障链上密码应用安全。
        </div>
        <div style={{ fontFamily: "SimSun, serif" }}>
          CryBlock集成<span className="highlight">70+</span>区块链安全团队的<span className="highlight">2000+</span>审计报告中的威胁情报，支持
          <span className="highlight">10+</span>类真实世界密码应用安全漏洞的在线检测，
        </div >
        <div style={{ fontFamily: "SimSun, serif" }}>
          已检出<span className="highlight">5000+</span>个真实世界密码应用安全漏洞，产出多篇国际顶级学术论文，并在国家重点研发计划项目中应用实践。
        </div>
      </div>



      
      <Flex 
        style={{ 
          color: "#fff", 
          fontSize: 35, 
          justifyContent: "center", 
          fontFamily: "SimSun, serif",  
          fontWeight: "bold",
          marginTop: "70px",
        }}
      >
        完备的漏洞类型覆盖
      </Flex>
      <div className="line2"></div>
      <div className="line1" ></div>
      <div class="content-3">
        <div>
          <div class="content-3-item first-item">
            <div class="content-3-top">10+</div>
            <div class="content-3-bottom" style={{ fontFamily: "SimSun, serif",  fontWeight: "bold"}}>覆盖10+种密码应用安全漏洞</div>
          </div>
          <div class="content-3-item second-item">
            <div class="content-3-top">2000+</div>
            <div class="content-3-bottom" style={{ fontFamily: "SimSun, serif",  fontWeight: "bold"}}>源自2000+真实世界审计报告</div>
          </div>
          <div class="content-3-item">
            <div class="content-3-top">70+</div>
            <div class="content-3-bottom" style={{ fontFamily: "SimSun, serif",  fontWeight: "bold"}}>汇总70+知名安全团队的安全实践</div>
          </div>
        </div>
      </div>
        
      
      

      <div className="content-4">
        <div 
          className="content-4-title" 
          style={{ 
            fontFamily: "SimSun, serif", 
            fontWeight: "bold", 
            marginTop: "25px", 
          }} 
        >
          精准的安全漏洞检测技术
        </div>
        <div 
          className="line2" 
          style={{ 
            transform: "translateY(-50px)" 
          }}
        ></div>
        
        <div 
          className="line1" 
          style={{ 
            transform: "translateY(-50px)"  
          }}
        ></div>
        <Flex justify="space-between" style={{ marginTop: "35px" }}>
          <Flex vertical gap={10} align="center">
            <Image
              src={require("./pic/icon1.png")}
              width={47}
              preview={false}
            />
            <div className="content-4-text" style={{ marginTop: '2px', fontFamily: "SimSun, serif",  fontWeight: "bold"}}>先进的模糊测试与污点分析技术</div>
          </Flex>
          <Flex vertical gap={10} align="center">
            <Image
              src={require("./pic/icon2.png")}
              width={45}
              preview={false}
            />
            <div className="content-4-text" style={{ marginTop: '4px', fontFamily: "SimSun, serif",  fontWeight: "bold"}}>实现超<span className="highlight"> 90% </span>的精确率与召回率</div>
          </Flex>
          <Flex vertical gap={10} align="center">
            <Image
              src={require("./pic/icon3.png")}
              width={50}
              preview={false}
            />
            <div className="content-4-text"  style={{ marginTop: '-1.8px', fontFamily: "SimSun, serif",  fontWeight: "bold" }}>多篇国际顶级学术论文技术积累</div>
          </Flex>
        </Flex>
      </div>




      <div className="content-5">
        <div 
          className="content-5-title" 
          style={{ 
            fontFamily: "SimSun, serif",  
            fontWeight: "bold", 
            marginTop: "80px"
          }}
        >
          全面的真实世界威胁情报
        </div>
        <div 
          className="line2" 
          style={{ 
            transform: "translateY(-20px)" 
          }}
        ></div>
        
        <div 
          className="line1" 
          style={{ 
            transform: "translateY(-40px)"  
          }}
        ></div>
        <Flex style={{ marginTop: "25px", justifyContent: "center", gap: '75px'}}>
          <Flex direction="column"  gap={10} style={{ maxWidth: "300px", textAlign: "center",alignItems: "center"}}>
           <Image src={require("./pic/分析.png")} width={110} />
            <span style={{ fontFamily: "SimSun, serif", fontWeight: "bold",fontSize: "18px" }}>
              覆盖<span className="highlight">400,000+</span>个真实世界密码应用的大规模实证分析
            </span>
          </Flex>
          
          <Flex direction="column" gap={10} style={{ maxWidth: "250px",textAlign: "center",alignItems: "center"}}>
            <Image src={require("./pic/研发.png")} width={95} style={{ marginLeft: 10 }} />
            <span style={{ fontFamily: "SimSun, serif", fontWeight: "bold" ,fontSize: "18px"}}>
              相关成果应用于国家重点研发计划
            </span>
          </Flex>

          <Flex direction="column" gap={10} style={{ maxWidth: "300px",textAlign: "center",alignItems: "center"}}>
            <Image src={require("./pic/漏洞.png")} width={95} style={{ marginLeft: 15 }} />
            <span style={{ fontFamily: "SimSun, serif", fontWeight: "bold",fontSize: "18px"}}>
              检测出<span className="highlight">5,000+</span>个真实世界密码应用安全漏洞
            </span>
          </Flex> 
        </Flex>
      </div>

      <div className="content-6" id="2">
        <div 
          className="content-6-title" 
          style={{ 
            fontFamily: "SimSun, serif",  
            fontWeight: "bold", 
            marginTop: "80px", 
            marginBottom: "40px"
          }}
        >
          安全案例
        </div>
        <Flex className="content-6-box" >
          {caseList.map((_, index) => (
            <ConfigProvider
            key={index}
              theme={{
                token: {
                  colorBgElevated: "#312d50",
                  colorText: "#fff",
                  colorTextHeading: "#fff",
                },
              }}
            >
              <Popover 
                placement="top"
                title={_.title}
                content={<div style={{ maxWidth: 300 }}>{_.describe}</div>}
              >
                <Flex
                  vertical
                  justify="center"
                  align="center"
                  gap={15}
                  onClick={() => caseClick(index)}
                >
                  <div
                    className="custom-box"
                    style={{
                      backgroundImage: `url(${_.img})`,
                      border: _.border ? "2px solid yellow" : "none",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        width: "100%",
                        textAlign: "center",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      [点击加载案例代码]
                    </div>
                  </div>
                  
                  <div className="content-6-box-title">{_.title}</div>
                </Flex>
              </Popover>
            </ConfigProvider>
          ))}
        </Flex>
      </div>

      <div className="content-6-title" 
        style={{ 
          fontFamily: "SimSun, serif", 
          fontWeight: "bold", 
          marginTop: "80px", 
          marginBottom:"-80px",
          textAlign: "center",
        }}
        >在线分析
      </div>

      <Layout
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          backgroundColor: "transparent",
          maxWidth: "1200px",  // 设置最大宽度
          margin: "0 auto", 
          width: "100%",
        }}
        id="3"
      >
        <Content style={{ padding: "0 20px", backgroundColor: "transparent" }}>
          <Layout
            style={{
              backgroundColor: "transparent",
              margin: "0 auto",
              maxWidth: "1200px",
            }}
          >
            {/* 左侧栏 */}
            <Sider
              width={200}
              style={{
                background: "transparent",
                textAlign: "center",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "70px",
              }}
            >
              <Card
                style={{
                  margin: "20px 0", 
                  textAlign: "center",
                  borderRadius: "8px",
                  border: "1px solid white",
                  backgroundColor: "transparent",
                  color: "white",
                  height: "40px", 
                  display: "flex",
                  alignItems: "center", 
                  justifyContent: "center", 
                  width: "100%", 
                  fontSize: "18px",
                  fontWeight: "bold"
                }}
              >
                Address
              </Card>

              <Card
                style={{
                  textAlign: "center",
                  borderRadius: "8px",
                  border: "1px solid white",
                  backgroundColor: "transparent",
                  color: "white",
                  height: "calc(100% - 60px)", 
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%", 
                  fontSize: "20px",
                  fontWeight: "bold"
                }}
              >
                Code
              </Card>
            </Sider>

            {/* 中间内容区域 */}
            <Content
              style={{
                flex: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                margin: "0 20px",
                backgroundColor: "transparent",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "100px",
                }}
              >
                <Input style={{ fontFamily: "SimSun, serif",fontSize: "16px"}}
                  placeholder="可输入合约地址或点击上方安全案例获取合约代码"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="custom-textarea"
                />
                <Button
                  className="shiny-button"
                  onClick={handleSearch}
                  type="primary"
                  style={{ marginLeft: "30px", width: "100px" }}
                >
                  <span style={{ display: "flex", alignItems: "center", fontSize: "18px",fontWeight: "bold"}}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 417"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "8px", 
                      }}
                    >
                      <g fill="#fff">
                        <path d="M127.8 0L127.2 3.4V277L127.8 277.6L255.6 208.6z" />
                        <path d="M127.8 0L0 208.6L127.8 277.6V147.9z" />
                        <path d="M127.8 300.9L127.5 301.4V413.7L127.8 416.9L255.7 235.5z" />
                        <path d="M127.8 416.9V300.9L0 235.5z" />
                        <path d="M127.8 277.6L255.6 208.6L127.8 147.9z" />
                        <path d="M0 208.6L127.8 277.6V147.9z" />
                      </g>
                    </svg>
                    Load
                  </span>
                </Button>
              </div>

              <div style={{ position: "relative", paddingTop: "10px" }}>
                <Editor
                  height="500px"
                  defaultLanguage="solidity"
                  value={code}
                  onChange={(value) => setCode(value)}
                  theme="vs-dark"
                  options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                    overviewRulerBorder: false, 
                    overviewRulerLanes: 0, 
                  }}
                  loading={true}
                  style={{
                    position: "relative",
                    top: "30px",               
                  }}
                  onMount={(editor, monaco)=>{
                    setMonaco(monaco)
                  }} 
                />
              </div>
            </Content>
          </Layout>



          <Flex vertical justify="center" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
            <Button 
              onClick={handleBtn} 
              className="bottom-button" 
              style={{ 
                fontFamily: "SimSun, serif", 
                fontSize: "18px",
                fontWeight: "bold",
                width: "100%",    
                maxWidth: "1200px",
                width: "calc(100% - 40px)", 
              }}
            >
              启动检测！
            </Button>

            <div className="content-6-title" 
              style={{ 
                fontFamily: "SimSun, serif", 
                fontWeight: "bold", 
                marginTop: "80px",
                marginBottom: "10px", 
              }}
              >分析结果
            </div>

            <div 
              style={{
                width: "calc(100% - 40px)",
                maxWidth: "1200px", 
                margin: "0 auto",
                marginTop: "30px",
                padding: "20px",
                borderRadius: "10px", 
                backgroundColor: "#1e1e1e", 
                border: "1.5px solid #ffffff", 
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" 
              }}
            >
                <Editor
                  height="500px"
                  defaultLanguage="json"
                  // 接口数据todo
                  value={`{
                      "success": true,
                      "error": null,
                      "results": {
                          "Vulnerability": {
                              "description": "FoMo3Dlong.airdrop() (crytic-export/etherscan-contracts/0xa62142888aba8370742be823c1782d17a0389da1-FoMo3Dlong.sol#1409-1428) uses a weak PRNG: (seed - ((seed / 1000) * 1000)) < airDropTracker_ (crytic-export/etherscan-contracts/0xa62142888aba8370742be823c1782d17a0389da1-FoMo3Dlong.sol#1424)",
                              "impact": "High",
                              "type": "weak-prng",
                              "vulnerable code segements": [
                                  {
                                      "type": "function",
                                      "name": "airdrop"
                                  },
                                  {
                                      "type": "node",
                                      "name": "(seed - ((seed / 1000) * 1000)) < airDropTracker_"
                                  }
                              ]
                          }
                      }
                  }`}
                  onChange={(value) => setCode(value)}
                  theme="vs-dark"
                  options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                    overviewRulerBorder: false, 
                    overviewRulerLanes: 0, 
                    readOnly: true,
                  }}
                  style={{
                    position: "relative", 
                    top: "30px", 
                    width: "100%"
                  }}
                  onMount={(editor, monaco)=>{
                    setMonaco(monaco)
                    
                  }}
                  
                />
              </div>
          </Flex>

          <Divider style={{ margin: "70px 0" }} />
        </Content>
      </Layout>
    </div>
  );
};

export default App;
