const uniswap = {
    encodePath(path: string[], fees: Array<number>): string {
      if (path.length != fees.length + 1) {
        throw new Error('path/fee lengths do not match');
      }
      let encoded = '0x';
      for (let i = 0; i < fees.length; i++) {
        encoded += path[i].slice(2);
        encoded += fees[i].toString(16).padStart(2 * 3, '0');
      }
      encoded += path[path.length - 1].slice(2);
      return encoded.toLowerCase();
    },
  };

function main(){
    const PATH = ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","0xdAC17F958D2ee523a2206206994597C13D831ec7"];
    const FEE = [500];
    const bytes = uniswap.encodePath(PATH, FEE);
    console.log(bytes);
}

main();



  