
using BCrypt.Net;
using BC = BCrypt.Net;
namespace Destixplorer.Services
{
    public class PasswordService
    {
        public string HashPassword(string password)
        {
            return BC.BCrypt.HashPassword(password);    
        }
        public bool VerifyPassword(string password, string hash)
        {
            return BC.BCrypt.Verify(password, hash);    
        }

    }
}

