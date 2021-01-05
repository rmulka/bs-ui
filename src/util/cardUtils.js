export const cardApiToImgMapper = (apiRank, apiSuit) => {
    const suits = {
        1: 'S',
        2: 'C',
        3: 'H',
        4: 'D'
    };

    const mapRank = (rank) => {
        switch(rank) {
            case 1:
                return 'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default:
                return rank;
        }
    };

    const suit = suits[apiSuit];
    const rank = mapRank(apiRank);

    return { suit, rank, imgString: `${rank}${suit}.png` };
};

export const mapApiCardsToPngStrings = (cards) =>
    cards.map(({ rank, suit }) => cardApiToImgMapper(rank, suit)).map(obj => obj.imgString);

export const sortCards = (cards) => {
    const compare = (a, b) => {
        if (a.rank < b.rank) return 1;
        if (a.rank > b.rank) return -1;
        return 0;
    }

    return cards.sort(compare);
}