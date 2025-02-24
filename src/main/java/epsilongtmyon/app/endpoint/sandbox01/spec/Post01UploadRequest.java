package epsilongtmyon.app.endpoint.sandbox01.spec;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public class Post01UploadRequest implements Serializable {

	private List<MultipartFile> files;

	public List<MultipartFile> getFiles() {
		return files;
	}

	public void setFiles(List<MultipartFile> files) {
		this.files = files;
	}

	@Override
	public String toString() {
		return "Post01UploadRequest [files=" + files + "]";
	}

}
