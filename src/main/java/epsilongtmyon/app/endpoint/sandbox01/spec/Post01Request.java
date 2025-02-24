package epsilongtmyon.app.endpoint.sandbox01.spec;

import java.io.Serializable;
import java.util.List;

public class Post01Request implements Serializable {

	private String value01;

	private String value02;

	private Post01NextRequest nestedObj;

	private List<Post01NextRequest> nestedList;

	public String getValue01() {
		return value01;
	}

	public void setValue01(String value01) {
		this.value01 = value01;
	}

	public String getValue02() {
		return value02;
	}

	public void setValue02(String value02) {
		this.value02 = value02;
	}

	public Post01NextRequest getNestedObj() {
		return nestedObj;
	}

	public void setNestedObj(Post01NextRequest nestedObj) {
		this.nestedObj = nestedObj;
	}

	public List<Post01NextRequest> getNestedList() {
		return nestedList;
	}

	public void setNestedList(List<Post01NextRequest> nestedList) {
		this.nestedList = nestedList;
	}

	@Override
	public String toString() {
		return "Post01Request [value01=" + value01 + ", value02=" + value02 + ", nestedObj=" + nestedObj
				+ ", nestedList=" + nestedList + "]";
	}

	public static class Post01NextRequest implements Serializable {

		private String nestValue01;

		public String getNestValue01() {
			return nestValue01;
		}

		public void setNestValue01(String nestValue01) {
			this.nestValue01 = nestValue01;
		}

		@Override
		public String toString() {
			return "Post01NextRequest [nestValue01=" + nestValue01 + "]";
		}

	}
}
