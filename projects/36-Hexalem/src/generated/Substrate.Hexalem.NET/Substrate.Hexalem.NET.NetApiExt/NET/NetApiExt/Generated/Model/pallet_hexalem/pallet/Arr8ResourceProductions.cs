//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using Substrate.NetApi.Attributes;
using Substrate.NetApi.Model.Types.Base;
using Substrate.NetApi.Model.Types.Metadata.V14;
using System.Collections.Generic;


namespace Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet
{
    
    
    /// <summary>
    /// >> 130 - Array
    /// </summary>
    [SubstrateNodeType(TypeDefEnum.Array)]
    public sealed class Arr8ResourceProductions : BaseType
    {
        
        private Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.ResourceProductions[] _value;
        
        public override int TypeSize
        {
            get
            {
                return 8;
            }
        }
        
        public Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.ResourceProductions[] Value
        {
            get
            {
                return this._value;
            }
            set
            {
                this._value = value;
            }
        }
        
        public override string TypeName()
        {
            return string.Format("[{0}; {1}]", new Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.ResourceProductions().TypeName(), this.TypeSize);
        }
        
        public override byte[] Encode()
        {
            var result = new List<byte>();
            foreach (var v in Value){result.AddRange(v.Encode());};
            return result.ToArray();
        }
        
        public override void Decode(byte[] byteArray, ref int p)
        {
            var start = p;
            var array = new Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.ResourceProductions[TypeSize];
            for (var i = 0; i < array.Length; i++) {var t = new Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.ResourceProductions();t.Decode(byteArray, ref p);array[i] = t;};
            var bytesLength = p - start;
            Bytes = new byte[bytesLength];
            System.Array.Copy(byteArray, start, Bytes, 0, bytesLength);
            Value = array;
        }
        
        public void Create(Substrate.Hexalem.NET.NetApiExt.Generated.Model.pallet_hexalem.pallet.ResourceProductions[] array)
        {
            Value = array;
            Bytes = Encode();
        }
    }
}
