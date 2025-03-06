import { RouterV3__factory } from "./typechain-types/factories/RouterV3__factory";
import { ethers, JsonRpcProvider, MaxUint256, Wallet, ZeroAddress } from "ethers";
import { ERC20__factory, QuoterV3__factory, QuoterV3Mix__factory, RouteV2__factory } from "./typechain-types";
import { RouteV2 } from "./typechain-types/RouteV2";
import * as dotenv from "dotenv";
dotenv.config();
async function main() {
    const beraProvider = new JsonRpcProvider("https://rpc.berachain.com/");

    const routerV3Address = "0xe301e48f77963d3f7dbd2a4796962bd7f3867fb4";
    const wallet = new Wallet(process.env.PRIVATE_KEY!, beraProvider);

    const routerV3 = RouterV3__factory.connect(routerV3Address, beraProvider);
    const quoterV3 = QuoterV3__factory.connect("0x644C8D6E501f7C994B74F5ceA96abe65d0BA662B", beraProvider);

    const quoteV3Mix = QuoterV3Mix__factory.connect("0xfa0276F06161cC2f66Aa51f3500484EdF8Fc94bB", beraProvider);

    const usdeAddress = "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34";

    const honeyAddress = "0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce";

    const poolfee = 500;

    const amountIn = ethers.parseUnits("1", 18);

    const path = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint24", "address"],
        [usdeAddress, poolfee, honeyAddress]
    );

    try {
        const quote = await quoteV3Mix.quoteExactInputSingleV2({
            tokenIn: usdeAddress,
            tokenOut: honeyAddress,
            amountIn: amountIn,
        });

        console.log(quote);
    } catch (error) {
        console.log("error quote");
    }

    try {
        const quote = await quoterV3.connect(wallet).quoteExactInput.staticCall(path, amountIn);
        console.log(quote);
    } catch (error) {
        //console.log(error);
        console.log("error quote");
    }

    const usde = ERC20__factory.connect(usdeAddress, beraProvider);

    let balanceUSDe = await usde.balanceOf(wallet.address);
    console.log("balanceUSDe", balanceUSDe.toString());

    try {
        //   const txResponse = await usde.connect(wallet).approve(await routerV3.getAddress(), MaxUint256);

        // const txReceipt = await txResponse.wait();

        const tx = await routerV3.connect(wallet).exactInputSingle.staticCallResult({
            tokenIn: usdeAddress,
            tokenOut: honeyAddress,
            fee: poolfee,
            recipient: wallet.address,
            //@ts-ignore
            deadline: BigInt(Math.floor(Date.now() / 1000) + 60),
            amountIn: balanceUSDe,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0,
        });
    } catch (e) {
        console.log("error", e);
    }
}
main();
