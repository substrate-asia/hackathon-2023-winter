using Substrate.NetApi.Model.Types;
using System;
using System.Collections.Generic;
using System.Text;

namespace Substrate.Hexalem.Integration.Helper
{
    public static class TypeExtension
    {
        public static T As<T>(this IType sender)
        {
            if (sender is T typed)
            {
                return typed;
            }

            throw new InvalidCastException();
        }
    }
}
