import { JsonRpcProvider } from "ethers";
import { RouteV2__factory } from "./typechain-types";
import { RouteV2 } from "./typechain-types/RouteV2";
async function main() {
    // Kodiak V2

    //https://documentation.kodiak.finance/overview/kodiak-contracts
    const kodiakV2RouterV2Address = "0xd91dd58387Ccd9B66B390ae2d7c66dBD46BC6022";
    const beraProvider = new JsonRpcProvider("https://rpc.berachain.com/");
    const routerV2 = RouteV2__factory.connect(kodiakV2RouterV2Address, beraProvider);

    // script  quote

    // script swap

    // Kodiak V3

    // script quote

    // script swap
}
