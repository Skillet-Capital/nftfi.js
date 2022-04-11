const NFTfi = require('../');

async function run() {
  const nftfi = await NFTfi.init();
  const listings = await nftfi.listings.get({
    filters: {
      nftAddresses: []
    },
    pagination: {
      limit: 20,
      skip: 0
    }
  });
  if (listings.length > 0) {
    const listing = listings[0];
    const offers = await nftfi.offers.get({
      filters: {
        nft: {
          id: listing.nft.id,
          address: listing.nft.address
        }
      }
    });
    console.log(
      `[INFO] found ${offers.length} offer(s) for listing ${nftfi.config.website.baseURI}/assets/${listing.nft.address}/${listing.nft.id}.`
    );
    if (offers.length > 0) {
      for (var i = 0; i < offers.length; i++) {
        const offer = offers[i];
        const duration = Math.floor(offer.terms.loan.duration / 86400);
        const repayment = nftfi.utils.formatEther(offer.terms.loan.repayment);
        const principal = nftfi.utils.formatEther(offer.terms.loan.principal);
        const apr = nftfi.utils.calcApr(principal, repayment, duration).toFixed(2);
        console.log(
          `[INFO] duration: ${duration} days; principal: ${principal}; repayment: ${repayment}; erc20: ${offer.terms.loan.currency}; APR: ${apr}%`
        );
      }
    }
  } else {
    console.log(`[INFO] found ${listings.length} listings. Can't get any corresponding offers at this time.`);
  }
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
