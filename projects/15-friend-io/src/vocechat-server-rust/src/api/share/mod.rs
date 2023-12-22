const ETH1: u128 = 10u128.pow(18);

pub fn get_price(supply: u128, amount: u128) -> usize {
    let sum1 = if supply == 0 {
        0
    } else {
        (supply - 1) * (supply) * (2 * (supply - 1) + 1) / 6
    };
    let sum2 = if supply == 0 && amount == 1 {
        0
    } else {
        (supply - 1 + amount) * (supply + amount) * (2 * (supply - 1 + amount) + 1) / 6
    };
    let summation = sum2 - sum1;
    return (summation * ETH1 / 16000u128).try_into().unwrap();
}

#[cfg(test)]
mod tests {

    use super::*;
    // 9000000000000000
    #[test]
    fn test_send() {
        let price = get_price(12,1);
        assert!(9000000000000000==price,"price error!");
        println!("price: {:?}", price);
    }
}

