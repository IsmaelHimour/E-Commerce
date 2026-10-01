namespace ShopSphere.Api.Services;

public class ServiceResult<T>
{
    private ServiceResult(bool succeeded, T? data, string? error)
    {
        Succeeded = succeeded;
        Data = data;
        Error = error;
    }

    public bool Succeeded { get; }

    public T? Data { get; }

    public string? Error { get; }

    public static ServiceResult<T> Success(T data)
    {
        return new ServiceResult<T>(true, data, null);
    }

    public static ServiceResult<T> Failure(string error)
    {
        return new ServiceResult<T>(false, default, error);
    }
}
