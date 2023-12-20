//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using Microsoft.AspNetCore.Mvc;
using Substrate.Hexalem.NET.RestService.Generated.Storage;
using Substrate.NetApi.Model.Types.Base;
using Substrate.ServiceLayer.Attributes;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace Substrate.Hexalem.NET.RestService.Generated.Controller
{
    
    
    /// <summary>
    /// TransactionPaymentController controller to access storages.
    /// </summary>
    [ApiController()]
    [Route("[controller]")]
    public sealed class TransactionPaymentController : ControllerBase
    {
        
        private ITransactionPaymentStorage _transactionPaymentStorage;
        
        /// <summary>
        /// TransactionPaymentController constructor.
        /// </summary>
        public TransactionPaymentController(ITransactionPaymentStorage transactionPaymentStorage)
        {
            _transactionPaymentStorage = transactionPaymentStorage;
        }
        
        /// <summary>
        /// >> NextFeeMultiplier
        /// </summary>
        [HttpGet("NextFeeMultiplier")]
        [ProducesResponseType(typeof(Substrate.Hexalem.NET.NetApiExt.Generated.Model.sp_arithmetic.fixed_point.FixedU128), 200)]
        [StorageKeyBuilder(typeof(Substrate.Hexalem.NET.NetApiExt.Generated.Storage.TransactionPaymentStorage), "NextFeeMultiplierParams")]
        public IActionResult GetNextFeeMultiplier()
        {
            return this.Ok(_transactionPaymentStorage.GetNextFeeMultiplier());
        }
        
        /// <summary>
        /// >> StorageVersion
        /// </summary>
        [HttpGet("StorageVersion")]
        [ProducesResponseType(typeof(Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_transaction_payment.EnumReleases), 200)]
        [StorageKeyBuilder(typeof(Substrate.Hexalem.NET.NetApiExt.Generated.Storage.TransactionPaymentStorage), "StorageVersionParams")]
        public IActionResult GetStorageVersion()
        {
            return this.Ok(_transactionPaymentStorage.GetStorageVersion());
        }
    }
}
